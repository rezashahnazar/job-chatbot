import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-20 text-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          صفحه مورد نظر پیدا نشد
        </h1>
        <p className="text-muted-foreground">
          متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.
        </p>
      </div>
      <Button asChild>
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </Button>
    </div>
  );
}
