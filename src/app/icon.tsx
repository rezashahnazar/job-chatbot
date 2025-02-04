import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized 'N' */}
          <path d="M6 4h2c6 0 6 16 12 16h-2c-6 0-6-16-12-16z" fill="#4F46E5" />

          {/* Decorative dot */}
          <circle cx="18" cy="6" r="1.5" fill="#4F46E5" />

          {/* Modern accent */}
          <path
            stroke="#4F46E5"
            strokeWidth="1"
            d="M4 20h16"
            strokeDasharray="2 2"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
