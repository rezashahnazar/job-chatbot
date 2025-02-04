"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          خطایی رخ داد
        </h1>
        <p className="text-muted-foreground">
          متاسفانه در پردازش درخواست شما مشکلی پیش آمده است.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="max-w-[600px] break-words text-sm text-muted-foreground">
            {error.message}
          </p>
        )}
      </div>
      <Button onClick={() => reset()}>تلاش مجدد</Button>
    </div>
  );
}
