import { type ReactNode } from "react";

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

const SKIP_LINK_CLASSES =
  "sr-only focus:not-sr-only focus:fixed focus:z-50 focus:p-4 focus:bg-background focus:text-foreground";

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a href={href} className={SKIP_LINK_CLASSES}>
      {children}
    </a>
  );
}
