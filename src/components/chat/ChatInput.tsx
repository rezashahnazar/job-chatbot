import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  chatInput: string;
  handleChatInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleMessageSubmit: (e: React.FormEvent) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isChatLoading: boolean;
  isGithubLoading: boolean;
  stopChat: () => void;
  stopGithub: () => void;
}

export function ChatInput({
  chatInput,
  handleChatInputChange,
  handleMessageSubmit,
  handleKeyPress,
  isChatLoading,
  isGithubLoading,
  stopChat,
  stopGithub,
}: ChatInputProps) {
  return (
    <div className="border-t p-4 bg-background/50">
      <form onSubmit={handleMessageSubmit} className="flex gap-2">
        <TextareaAutosize
          value={chatInput}
          onChange={handleChatInputChange}
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
            disabled={isChatLoading || isGithubLoading || !chatInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
          {(isChatLoading || isGithubLoading) && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-11 w-11"
              onClick={() => {
                if (isChatLoading) stopChat();
                if (isGithubLoading) stopGithub();
              }}
            >
              <Square className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
