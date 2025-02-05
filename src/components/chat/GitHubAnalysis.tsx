import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface GitHubAnalysisProps {
  githubInput: string;
  handleGithubInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGithubSubmit: (e: React.FormEvent) => void;
  isGithubLoading: boolean;
}

export function GitHubAnalysis({
  githubInput,
  handleGithubInputChange,
  handleGithubSubmit,
  isGithubLoading,
}: GitHubAnalysisProps) {
  return (
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
        <form onSubmit={handleGithubSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="مثال: https://github.com/username/repo"
            value={githubInput}
            onChange={handleGithubInputChange}
            className="bg-background/50 text-left"
            dir="ltr"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isGithubLoading || !githubInput}
          >
            {isGithubLoading ? (
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
  );
}
