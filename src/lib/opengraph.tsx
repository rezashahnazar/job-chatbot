import { ImageResponse } from "next/og";
import { ReactNode } from "react";

const domainAddress = new URL(
  process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://shahnazar.me")
).origin;

const projectBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "/";

/**
 * Processes a background image URL for OpenGraph image generation.
 *
 * This function handles two scenarios:
 * 1. Absolute URLs (e.g., https://example.com/image.jpg):
 *    - Returns the URL as-is after validating it's a proper URL
 *
 * 2. Relative paths (e.g., "images/background.jpg"):
 *    - Combines with domain and project base path
 *    - Cleans the path by removing empty segments and normalizing slashes
 *    - Creates a proper absolute URL required by OpenGraph image generation
 *
 * @example
 * // Absolute URL
 * processBackgroundImageSrcURL("https://example.com/image.jpg")
 * // Returns: "https://example.com/image.jpg"
 *
 * // Relative path with base path "/app"
 * processBackgroundImageSrcURL("images/bg.jpg")
 * // Returns: "https://domain.com/app/images/bg.jpg"
 *
 * @param url - The image URL or path to process
 * @returns A properly formatted absolute URL string
 */
const processBackgroundImageSrcURL = (url: string) => {
  try {
    // Check if it's already an absolute URL
    return new URL(url).toString();
  } catch {
    // Clean up path and create absolute URL
    const cleanPath = url.split("/").filter(Boolean).join("/");
    const basePath = projectBasePath.split("/").filter(Boolean).join("/");
    return `${domainAddress}/${[basePath, cleanPath]
      .filter(Boolean)
      .join("/")}`;
  }
};

/**
 * Renders Persian text properly for Open Graph image generation.
 *
 * This function handles several complexities specific to Persian text rendering:
 * 1. Reverses the word order to handle RTL text correctly in OG images
 * 2. Preserves the internal character order within each word
 * 3. Handles ZWNJ (Zero Width Non-Joiner) characters (‌) properly
 * 4. Adds proper spacing around English text segments
 *
 * @example
 * ```tsx
 * const persianText = renderPersianTextForOpenGraphImage("سلام به Next.js خوش آمدید");
 * // Will render with proper spacing: "سلام به Next.js خوش آمدید"
 * ```
 *
 * @param text - The Persian text to be rendered in the OG image
 * @param style - Optional CSS styles to override default text styling
 * @returns ReactNode with properly formatted Persian text and styling
 */
export function renderPersianTextForOpenGraphImage(
  text: string,
  style?: React.CSSProperties
): ReactNode {
  // Function to check if a string contains English characters
  const hasEnglish = (str: string) => /[a-zA-Z]/.test(str);

  // Split text into words and process each word
  const words = text.split(" ");
  const processedWords = words.map((word) => {
    if (hasEnglish(word)) {
      // Add spaces around English text
      return ` ${word} `;
    }
    return word;
  });

  const reversedText = processedWords.reverse().join(" ");
  const reversedTextParts = reversedText.split(" ");

  // For each part, split by ZWNJ, reverse sub-parts and rejoin with ZWNJ
  const parts = reversedTextParts.map((part) => {
    // Skip processing if it's an English word (to preserve its direction)
    if (hasEnglish(part)) {
      return part.trim();
    }
    return part.split("‌").reverse().join("‌");
  });

  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        direction: "rtl",
        fontSize: 36,
        lineHeight: 1.8,
        fontWeight: 500,
        fontFamily: "IRANYekan",
        textAlign: "center",
        letterSpacing: "0",
        ...style,
      }}
    >
      {parts.map((part, index) =>
        part === "‌" ? (
          <div key={index} />
        ) : hasEnglish(part) ? (
          <div
            key={index}
            style={{
              display: "flex",
              direction: "ltr",
              margin: "0 0.15em",
              letterSpacing: "0.05em",
            }}
          >
            {part}
          </div>
        ) : (
          <div key={index}>{part}</div>
        )
      )}
    </div>
  );
}

/**
 * Configuration options for OpenGraph image generation
 */
interface OpenGraphImageOptions {
  /** The logo component to be displayed at the top of the image */
  logo: React.ReactNode;
  /** The main title text in Persian */
  title: string;
  /** The first line of Persian text below the title */
  line1: string;
  /** The second line of Persian text below line2 */
  line2: string;
  /**
   * Optional background image URL or path to use instead of the default gradient.
   *
   * This can be either:
   * 1. An absolute URL (e.g., "https://example.com/image.jpg")
   * 2. A relative path from the project root (e.g., "images/background.jpg")
   *
   * The image will be:
   * - Automatically processed to ensure it's an absolute URL (required by OpenGraph)
   * - Stretched to cover the entire image area while maintaining aspect ratio
   * - Centered within the container
   *
   * If not provided, a default dark gradient background will be used.
   *
   * @example
   * // Absolute URL
   * backgroundImageSrc: "https://example.com/image.jpg"
   *
   * // Relative path (will be combined with domain and base path)
   * backgroundImageSrc: "images/background.jpg"
   */
  backgroundImageSrc?: string;
}

/**
 * Creates a beautiful OpenGraph image with Persian text support.
 *
 * This function generates a professional-looking OpenGraph image with:
 * - Dark theme with blue accents
 * - Gradient background with subtle grid pattern
 * - Decorative circles for visual interest
 * - Custom logo in a glowing blue container
 * - Title and two lines of Persian text
 * - Proper RTL text handling
 * - IRANYekan font with multiple weights
 * - Fixed dimensions of 1200x630 pixels (standard OpenGraph size)
 *
 * @example
 * ```tsx
 * const ogImage = await createOpenGraphImage({
 *   logo: <YourLogoComponent />,
 *   title: "عنوان به فارسی",
 *   line1: "خط اول به فارسی",
 *   line2: "خط دوم به فارسی",
 * });
 * ```
 *
 * @param options - Configuration options for the OpenGraph image
 * @returns Promise<ImageResponse> - The generated image response
 */
export async function createOpenGraphImage({
  logo,
  title,
  line1,
  line2,
  backgroundImageSrc,
}: OpenGraphImageOptions): Promise<ImageResponse> {
  // Standard OpenGraph image dimensions
  const width = 1200;
  const height = 630;

  // Load IRANYekan font files with different weights
  const [fontData, fontDataBold, fontDataBlack] = await Promise.all([
    fetch(
      new URL("../fonts/IranYekan/iranyekan_medium.woff", import.meta.url)
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL("../fonts/IranYekan/iranyekan_extrabold.woff", import.meta.url)
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL("../fonts/IranYekan/iranyekan_black.woff", import.meta.url)
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      // Full Container
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          position: "absolute",
          overflow: "hidden",
        }}
      >
        {/* Background Image or Gradient */}
        {backgroundImageSrc ? (
          // Custom Background Image
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              top: "0",
              backgroundImage: `url(${processBackgroundImageSrcURL(
                backgroundImageSrc
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          // Default Gradient Background
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              top: "0",
              background:
                "linear-gradient(0deg, #000000, #060606 20%, #000000 55%, #060606 80% , #000000)",
              opacity: 0.95,
            }}
          />
        )}
        {/* Inner Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "48px",
            padding: "0 64px",
          }}
        >
          {/* Logo Container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#000000",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "28px",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
              width: "100px",
              height: "100px",
            }}
          >
            {logo}
          </div>

          {/* Text Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              textAlign: "center",
            }}
          >
            {/* Title */}
            {renderPersianTextForOpenGraphImage(title, {
              fontSize: 60,
              lineHeight: 1.1,
              fontWeight: 900,
              color: "white",
              textShadow: "0 4px 16px rgba(0, 112, 243, 0.2)",
            })}

            {/* Description */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#fff",
                  fontWeight: 500,
                  textAlign: "center",
                  fontFamily: "IRANYekan",
                  opacity: 0.9,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "-10px", // Adjust this value to move the text to the right for compensation of Misplacement of Persian Text
                }}
              >
                {renderPersianTextForOpenGraphImage(line1, {
                  fontSize: 36,
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#fff",
                  fontWeight: 500,
                  textAlign: "center",
                  fontFamily: "IRANYekan",
                  opacity: 0.7,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderPersianTextForOpenGraphImage(line2, {
                  fontSize: 32,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: "IRANYekan",
          data: fontData,
          weight: 500,
          style: "normal",
        },
        {
          name: "IRANYekan",
          data: fontDataBold,
          weight: 800,
          style: "normal",
        },
        {
          name: "IRANYekan",
          data: fontDataBlack,
          weight: 900,
          style: "normal",
        },
      ],
    }
  );
}
