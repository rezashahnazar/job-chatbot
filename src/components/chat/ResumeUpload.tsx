import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job, Message } from "@/types/chat";
import {
  createResumeNotification,
  createResumeSystemMessage,
} from "@/utils/chat";

interface ResumeUploadProps {
  jobs: Job[];
  jobsLoading: boolean;
  setChatMessages: (
    messages: Message[] | ((prev: Message[]) => Message[])
  ) => void;
  scrollToBottom: () => void;
}

export function ResumeUpload({
  jobs,
  jobsLoading,
  setChatMessages,
  scrollToBottom,
}: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !email || !position) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

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

      // Create messages
      const systemMessage = createResumeSystemMessage(data.analysis);
      const notificationMessage = createResumeNotification();

      // Add current timestamp to messages
      systemMessage.createdAt = new Date();
      notificationMessage.createdAt = new Date();

      // Update chat messages
      setChatMessages((prevMessages) => {
        // Find the last system message index (if any)
        const lastSystemIndex = [...prevMessages]
          .reverse()
          .findIndex((m) => m.role === "system");

        if (lastSystemIndex === -1) {
          // No system message exists, add to the end
          return [...prevMessages, systemMessage, notificationMessage];
        } else {
          // Replace the existing system message and add notification at the end
          const actualIndex = prevMessages.length - 1 - lastSystemIndex;
          const newMessages = [...prevMessages];
          newMessages[actualIndex] = systemMessage;
          return [...newMessages, notificationMessage];
        }
      });

      // Scroll to bottom after messages are updated
      setTimeout(() => scrollToBottom(), 100);

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
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="موقعیت شغلی مورد نظر" />
              </SelectTrigger>
              <SelectContent>
                {jobsLoading ? (
                  <SelectItem value="loading" disabled>
                    در حال بارگذاری...
                  </SelectItem>
                ) : jobs.length === 0 ? (
                  <SelectItem value="no-jobs" disabled>
                    موقعیت شغلی یافت نشد
                  </SelectItem>
                ) : (
                  jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
  );
}
