import { Loader2 } from "lucide-react";

export function LoadingMessage() {
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
