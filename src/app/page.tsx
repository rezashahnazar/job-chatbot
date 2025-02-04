import JobChat from "@/components/JobChat";
import {
  MessageSquare,
  FileText,
  Github,
  ArrowUpRight,
  Bot,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="w-full border-b bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="flex items-center gap-4 pb-2">
              <div className="h-[54px] w-[54px] translate-y-1 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <MessageSquare className="!size-8 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  دستیار هوشمند استخدام
                </h1>
                <p className="text-xs text-muted-foreground">
                  کمک به شما در مسیر شغلی با هوش مصنوعی
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <div className="w-full bg-background/50 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x-reverse divide-x divide-border/50">
            <div className="px-4 py-2.5 text-center group cursor-default">
              <span className="text-sm font-medium text-muted-foreground/90 transition-colors group-hover:text-primary">
                گفتگوی هوشمند
              </span>
            </div>
            <div className="px-4 py-2.5 text-center group cursor-default">
              <span className="text-sm font-medium text-muted-foreground/90 transition-colors group-hover:text-primary">
                آنالیز رزومه
              </span>
            </div>
            <div className="px-4 py-2.5 text-center group cursor-default">
              <span className="text-sm font-medium text-muted-foreground/90 transition-colors group-hover:text-primary">
                تحلیل گیت‌هاب
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <JobChat />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              طراحی شده با ❤️ توسط رضا شاه‌نظر &copy; {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:reza.shahnazar@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                تماس با ما
              </a>
              <a
                href="https://github.com/rezashahnazar/job-chatbot"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                مستندات
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
