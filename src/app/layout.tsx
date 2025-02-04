import "./globals.css";
import { CustomThemeProvider } from "@/components/theme/theme-provider";
import { IRANYekan } from "@/fonts/local-fonts";
import { cn } from "@/lib/utils";
import { SkipLink } from "@/components/layout/skip-link";
import type { Viewport } from "next";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "دستیار هوشمند شغلی",
  description: "دستیار هوشمند شغلی",
  authors: [
    { name: "Reza Shahnazar", url: "https://github.com/rezashahnazar" },
  ],
  creator: "Reza Shahnazar",
  metadataBase: new URL("https://shahnazar.me"),
  openGraph: {
    title: "دستیار هوشمند شغلی",
    description: "دستیار هوشمند شغلی",
    type: "website",
    url: "https://shahnazar.me",
    siteName: "دستیار هوشمند شغلی",
    images: [
      {
        url: "https://shahnazar.me/opengraph-image",
        width: 1200,
        height: 630,
        alt: "دستیار هوشمند شغلی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "دستیار هوشمند شغلی",
    description: "دستیار هوشمند شغلی",
    images: ["https://shahnazar.me/opengraph-image"],
  },
  publisher: "Digikala",
};

export const viewport: Viewport = {
  themeColor: "hsl(var(--background))",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  height: "device-height",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body
        className={cn(
          IRANYekan.className,
          vazirmatn.className,
          "antialiased bg-background text-foreground"
        )}
      >
        <CustomThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink href="#main-content">رفتن به محتوای اصلی</SkipLink>
          <main id="main-content" className="w-full mx-auto">
            {children}
          </main>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
