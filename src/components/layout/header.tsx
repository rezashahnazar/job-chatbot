import { ThemeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  logo: React.ReactNode;
  className?: string;
}

export function Header({ title, logo, className }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full", className)}>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 transition-colors hover:text-primary"
          aria-label="صفحه اصلی"
        >
          {logo}
          <span className="text-md font-bold tracking-tight">{title}</span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
