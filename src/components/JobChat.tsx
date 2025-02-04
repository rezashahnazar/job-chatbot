"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Send,
  Loader2,
  MessageSquare,
  FileText,
  ArrowDown,
  Bot,
  Square,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import TextareaAutosize from "react-textarea-autosize";
import { Message } from "ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

function LoadingMessage() {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-muted/50 mr-8">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin">
            <Loader2 className="h-4 w-4" />
          </div>
          <div className="text-sm text-muted-foreground">
            در حال نوشتن پاسخ...
          </div>
        </div>
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}

export default function JobChat() {
  // Regular chat instance
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    isLoading,
    setMessages,
    stop,
  } = useChat({
    api: "/api/chat",
  });

  // GitHub chat instance
  const {
    messages: githubMessages,
    handleSubmit: handleGithubChatSubmit,
    isLoading: isGithubLoading,
    input: githubUrl,
    handleInputChange: handleGithubInputChange,
    setMessages: setGithubMessages,
    stop: stopGithub,
  } = useChat({
    api: "/api/github",
    id: "github-analysis",
    initialInput: "",
  });

  // We don't need lastGithubAnalysis state anymore since we'll show messages directly
  const [githubLoading, setGithubLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastMessageRef = useRef<string | null>(null);
  const lastIsLoadingRef = useRef(isLoading);
  const lastGithubMessageRef = useRef<string | null>(null);
  const lastGithubIsLoadingRef = useRef(isGithubLoading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: "auto" | "smooth" = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  // Handle scroll position
  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    const threshold = 100; // Show button when user has scrolled up more than 100px from bottom

    setShowScrollButton(scrollPosition > threshold);
  };

  // Scroll to bottom only after message submission or during streaming
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const lastGithubMessage = githubMessages[githubMessages.length - 1];

    const isNewMessage = lastMessage?.content !== lastMessageRef.current;
    const isNewGithubMessage =
      lastGithubMessage?.content !== lastGithubMessageRef.current;

    const isStreamingStarted =
      (!lastIsLoadingRef.current && isLoading) ||
      (!lastGithubIsLoadingRef.current && isGithubLoading);

    const isStreamingMessage =
      (isLoading && lastMessage?.role === "assistant") ||
      (isGithubLoading && lastGithubMessage?.role === "assistant");

    // Update refs for next comparison
    lastMessageRef.current = lastMessage?.content ?? null;
    lastIsLoadingRef.current = isLoading;
    lastGithubMessageRef.current = lastGithubMessage?.content ?? null;
    lastGithubIsLoadingRef.current = isGithubLoading;

    // Scroll conditions:
    // 1. New user message was just submitted (from either chat)
    // 2. Streaming just started (from either chat)
    // 3. Currently streaming assistant message (from either chat)
    if (
      (isNewMessage && lastMessage?.role === "user") ||
      (isNewGithubMessage && lastGithubMessage?.role === "user") ||
      isStreamingStarted ||
      isStreamingMessage
    ) {
      scrollToBottom(isStreamingMessage ? "auto" : "smooth");
    }
  }, [messages, isLoading, githubMessages, isGithubLoading]);

  // Function to check if a message contains a GitHub repository URL
  const containsGithubUrl = (text: string) => {
    return /https:\/\/github\.com\/[\w-]+\/[\w-]+/.test(text);
  };

  // Function to extract GitHub URL from text
  const extractGithubUrl = (text: string) => {
    const match = text.match(/https:\/\/github\.com\/[\w-]+\/[\w-]+/);
    return match ? match[0] : null;
  };

  // Handle regular chat submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleChatSubmit(e);
  };

  // Function to create a system message from GitHub analysis
  const createGithubAnalysisSystemMessage = (githubMessages: Message[]) => {
    const lastAssistantMessage = githubMessages.findLast(
      (m) => m.role === "assistant"
    );
    if (!lastAssistantMessage) return null;

    return {
      id: `github-context-${Date.now()}`,
      role: "system",
      content: `GitHub Repository Analysis Context:
${lastAssistantMessage.content}

Please use this repository analysis information when answering questions about the user's GitHub project.`,
    } as Message;
  };

  // Effect to update main chat context when GitHub analysis is completed
  useEffect(() => {
    const lastMessage = githubMessages[githubMessages.length - 1];
    if (lastMessage?.role === "assistant" && !isGithubLoading) {
      const systemMessage = createGithubAnalysisSystemMessage(githubMessages);
      if (systemMessage) {
        setMessages((prevMessages) => {
          // Find and remove any previous GitHub analysis context
          const messagesWithoutPreviousGithub = prevMessages.filter(
            (m) => !m.id?.startsWith("github-context-")
          );
          // Add the new GitHub analysis context at the beginning
          return [systemMessage, ...messagesWithoutPreviousGithub];
        });

        // Add a notification message
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `notification-${Date.now()}`,
            role: "assistant",
            content:
              "✨ تحلیل مخزن گیت‌هاب به عنوان زمینه به چت اضافه شد. می‌توانید سوالات خود را درباره پروژه بپرسید.",
          } as Message,
        ]);
      }
    }
  }, [githubMessages, isGithubLoading, setMessages]);

  // Handle GitHub repository submission
  const handleGithubRepoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;

    const validGithubUrl = extractGithubUrl(githubUrl);
    if (!validGithubUrl) {
      alert("لطفاً یک لینک معتبر گیت‌هاب وارد کنید");
      return;
    }

    try {
      setGithubLoading(true);
      await handleGithubChatSubmit(e);
    } catch (error) {
      console.error("GitHub analysis error:", error);
      alert(
        "متأسفانه در تحلیل مخزن گیت‌هاب خطایی رخ داد. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setGithubLoading(false);
    }
  };

  // Combine regular chat messages with GitHub messages
  const allMessages = useMemo(() => {
    return [...messages, ...githubMessages].sort((a, b) => {
      return (
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
      );
    });
  }, [messages, githubMessages]);

  // Handle textarea key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e as any);
      }
    }
  };

  // Helper function to convert comma-separated string to markdown list
  const formatToMarkdownList = (text: unknown) => {
    if (!text) return "";

    // Handle array input
    if (Array.isArray(text)) {
      return text.map((item) => `- ${String(item).trim()}`).join("\n");
    }

    // Convert to string and handle comma-separated values
    const textStr = String(text);
    if (!textStr.includes(",")) {
      return `- ${textStr.trim()}`;
    }

    return textStr
      .split(",")
      .map((item) => `- ${item.trim()}`)
      .join("\n");
  };

  // Function to create a system message about the resume
  const createResumeSystemMessage = (analysis: any) => {
    const formattedStrengths = formatToMarkdownList(analysis.strengths);
    const formattedImprovements = formatToMarkdownList(analysis.improvements);

    return {
      id: `resume-${Date.now()}`,
      role: "system",
      content: `User's Resume Analysis:
Score: ${analysis.score ?? 0}%

Strengths:
${formattedStrengths}

Areas for Improvement:
${formattedImprovements}

Overall Feedback:
${analysis.feedback ?? ""}

Please use this information when answering questions about the user's resume.`,
    } as Message;
  };

  // Function to create a notification message about resume context
  const createResumeNotification = () => {
    return {
      id: `notification-${Date.now()}`,
      role: "assistant",
      content:
        "✨ رزومه شما با موفقیت آپلود و تحلیل شد. اکنون می‌توانید سوالات خود را درباره رزومه‌تان بپرسید.",
    } as Message;
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !email || !position) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError(null);
    setShowAnalysis(false);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("position", position);
      formData.append("resume", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnalysis(data.analysis);
      setShowAnalysis(true);

      // Add resume context to chat
      const systemMessage = createResumeSystemMessage(data.analysis);
      const notificationMessage = createResumeNotification();

      // Update messages with system context and notification
      setMessages((prevMessages) => {
        // Find the last system message index (if any)
        const lastSystemIndex = [...prevMessages]
          .reverse()
          .findIndex((m) => m.role === "system");

        if (lastSystemIndex === -1) {
          // No system message exists, add to the beginning
          return [systemMessage, ...prevMessages, notificationMessage];
        } else {
          // Replace the existing system message
          const actualIndex = prevMessages.length - 1 - lastSystemIndex;
          const newMessages = [...prevMessages];
          newMessages[actualIndex] = systemMessage;
          return [...newMessages, notificationMessage];
        }
      });

      // Clear the form
      setName("");
      setEmail("");
      setPosition("");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      console.log("File dropped:", files[0]);
      setFile(files[0] || null);
    },
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar - Tools */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Resume Upload Card */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">آپلود رزومه</h3>
                <p className="text-sm text-muted-foreground">
                  رزومه خود را آپلود کنید تا آن را تحلیل کنیم
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="نام"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50"
                />
                <Input
                  type="email"
                  placeholder="ایمیل"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                />
                <Input
                  type="text"
                  placeholder="موقعیت شغلی مورد نظر"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
                  isDragActive
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-medium">
                  {file ? file.name : "فایل رزومه خود را اینجا رها کنید"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  یا برای انتخاب فایل کلیک کنید (فقط PDF)
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !file || !name || !email || !position}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال آپلود...
                  </>
                ) : (
                  "آپلود و آنالیز رزومه"
                )}
              </Button>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </form>
          </div>
        </Card>

        {/* GitHub Analysis Card */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Github className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">آنالیز مخزن گیت‌هاب</h3>
                <p className="text-sm text-muted-foreground">
                  لینک مخزن گیت‌هاب خود را وارد کنید
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <form onSubmit={handleGithubRepoSubmit} className="space-y-4">
              <Input
                type="url"
                placeholder="مثال: https://github.com/username/repo"
                value={githubUrl}
                onChange={handleGithubInputChange}
                className="bg-background/50 text-left"
                dir="ltr"
              />
              <Button
                type="submit"
                className="w-full"
                disabled={githubLoading || !githubUrl}
              >
                {githubLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال آنالیز...
                  </>
                ) : (
                  "آنالیز مخزن"
                )}
              </Button>
            </form>
          </div>
        </Card>
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
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 rounded-lg p-4 transition-colors animate-in slide-in-from-bottom-2",
                      message.role === "user"
                        ? "bg-primary/10 mr-12"
                        : message.role === "assistant"
                        ? "bg-muted/50 ml-12"
                        : "bg-secondary/50"
                    )}
                  >
                    {message.role === "user" ? (
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                    ) : message.role === "assistant" ? (
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2 overflow-hidden">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        className="prose prose-sm dark:prose-invert max-w-none break-words"
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return match ? (
                              <div className="relative">
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-md !mt-0"
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code {...props} className={className}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && <LoadingMessage />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t p-4 bg-background/50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <TextareaAutosize
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="پیام خود را بنویسید... (Enter برای ارسال، Shift + Enter برای خط جدید)"
                className="flex-1 resize-none rounded-md border bg-background/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                maxRows={5}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  size="icon"
                  className="h-11 w-11"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
                {isLoading && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-11 w-11"
                    onClick={stop}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
