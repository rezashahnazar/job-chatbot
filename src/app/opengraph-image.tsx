import { createOpenGraphImage } from "@/lib/opengraph";
import { Logo } from "@/components/brand/logo";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "edge";
export const alt = "Next.js RTL Boilerplate";

export default async function Image() {
  return createOpenGraphImage({
    logo: <Logo size={80} />,
    title: "Shahnazar.Me",
    line1: "وبسایت شخصی",
    line2: "رضا شاه‌نظر",
  });
}
