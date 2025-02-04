import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 24 }: LogoProps) {
  return (
    <svg
      className={cn("text-primary", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Stylized 'N' with Persian calligraphy influence */}
      <path
        className="fill-primary"
        d="M6 4h2c6 0 6 16 12 16h-2c-6 0-6-16-12-16z"
      >
        <animate
          attributeName="opacity"
          dur="3s"
          values="0.95;1;0.95"
          repeatCount="indefinite"
        />
      </path>

      {/* Decorative dot - inspired by Persian diacritical marks */}
      <circle cx="18" cy="6" r="1.5" className="fill-primary">
        <animate
          attributeName="r"
          dur="3s"
          values="1.2;1.5;1.2"
          repeatCount="indefinite"
        />
      </circle>

      {/* Modern geometric accent */}
      <path
        className="stroke-primary"
        strokeWidth="1"
        d="M4 20h16"
        strokeDasharray="2 2"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="15s"
          values="0;100"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
