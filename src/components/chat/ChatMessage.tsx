import { Bot, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
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
              const match = /language-(\w+)/.exec(className || "");
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
  );
}
