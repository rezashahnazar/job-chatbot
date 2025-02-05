"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Bot, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Message } from "@/types/chat";
import { checkGithubUrl } from "@/utils/chat";
import { LoadingMessage } from "./chat/LoadingMessage";
import { ResumeUpload } from "./chat/ResumeUpload";
import { GitHubAnalysis } from "./chat/GitHubAnalysis";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { Job } from "@/types/chat";

export default function JobChat() {
  // Regular chat instance
  const {
    messages: chatMessages,
    input: chatInput,
    handleInputChange: handleChatInputChange,
    handleSubmit: handleChatSubmit,
    isLoading: isChatLoading,
    setMessages: setChatMessages,
    stop: stopChat,
  } = useChat({
    api: "/api/chat",
  });

  // GitHub chat instance
  const {
    messages: githubMessages,
    input: githubInput,
    handleInputChange: handleGithubInputChange,
    handleSubmit: handleGithubSubmit,
    isLoading: isGithubLoading,
    stop: stopGithub,
  } = useChat({
    api: "/api/github",
    id: "github-analysis",
  });

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const lastIsLoadingRef = useRef(isChatLoading || isGithubLoading);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: "auto" | "smooth" = "smooth") => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  // Handle scroll position
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    const threshold = 100;

    // Enable auto-scroll when user scrolls near bottom
    setAutoScroll(scrollPosition <= threshold);
  };

  // Combine all messages
  const allMessages = useMemo(() => {
    return [...chatMessages, ...githubMessages].sort((a, b) => {
      return (
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
      );
    });
  }, [chatMessages, githubMessages]);

  // Handle message submission with GitHub URL detection
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Check if message contains GitHub URL
    const githubUrl = checkGithubUrl(chatInput);
    if (githubUrl) {
      // Add user message to chat messages first
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: chatInput,
          role: "user",
          createdAt: new Date(),
        } as Message,
      ]);

      // Then trigger GitHub analysis
      handleGithubSubmit(e);
    } else {
      handleChatSubmit(e);
    }
  };

  // Handle textarea key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.trim()) {
        handleMessageSubmit(e);
      }
    }
  };

  // Scroll to bottom only after message submission or during streaming
  useEffect(() => {
    const lastMessage = allMessages[allMessages.length - 1];
    const isNewMessage = lastMessage?.content !== lastMessageRef.current;
    const isLoading = isChatLoading || isGithubLoading;
    const wasLoading = lastIsLoadingRef.current;
    const isStreamingStarted = !wasLoading && isLoading;

    // Update refs for next comparison
    lastMessageRef.current = lastMessage?.content ?? null;
    lastIsLoadingRef.current = isLoading;

    // Only auto-scroll in these cases if autoScroll is enabled:
    // 1. When a new user message is submitted (instant feedback)
    // 2. When streaming starts (show the loading state)
    // 3. When new content arrives during active streaming
    const shouldScroll =
      autoScroll &&
      ((isNewMessage && lastMessage?.role === "user") || // User just sent a message
        isStreamingStarted || // Stream just started
        (isLoading && isNewMessage && lastMessage?.role === "assistant")); // New content during active streaming

    if (shouldScroll) {
      scrollToBottom(isLoading ? "auto" : "smooth");
    }
  }, [allMessages, isChatLoading, isGithubLoading, autoScroll]);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar - Tools */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Resume Upload Card */}
        <ResumeUpload
          jobs={jobs}
          jobsLoading={jobsLoading}
          setChatMessages={setChatMessages}
          scrollToBottom={scrollToBottom}
        />

        {/* GitHub Analysis Card */}
        <GitHubAnalysis
          githubInput={githubInput}
          handleGithubInputChange={handleGithubInputChange}
          handleGithubSubmit={handleGithubSubmit}
          isGithubLoading={isGithubLoading}
          stopGithub={stopGithub}
        />
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">گفتگو با دستیار</h3>
                <p className="text-sm text-muted-foreground">
                  سوالات خود را درباره موقعیت‌های شغلی، رزومه یا مخزن گیت‌هاب
                  بپرسید
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="h-[520px] overflow-y-auto p-4 space-y-4 scrollbar-thin"
          >
            {allMessages.length === 0 ? (
              <div className="h-[calc(100%-2rem)] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">به دستیار استخدام خوش آمدید</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      می‌توانید درباره موقعیت‌های شغلی سوال بپرسید، رزومه خود را
                      آنالیز کنید یا مخزن گیت‌هاب خود را بررسی کنید
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {allMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {(isChatLoading || isGithubLoading) && <LoadingMessage />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <ChatInput
            chatInput={chatInput}
            handleChatInputChange={handleChatInputChange}
            handleMessageSubmit={handleMessageSubmit}
            handleKeyPress={handleKeyPress}
            isChatLoading={isChatLoading}
            isGithubLoading={isGithubLoading}
            stopChat={stopChat}
            stopGithub={stopGithub}
          />
        </Card>
      </div>
    </div>
  );
}
