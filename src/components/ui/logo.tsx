export function Logo({
  className = "",
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background with subtle gradient */}
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <rect
        width="32"
        height="32"
        rx="8"
        fill="url(#gradient)"
        className="opacity-50"
      />

      {/* Stylized hexagon for Next.js */}
      <path
        d="M16.731 23.86c-.237.132-.534.132-.771 0l-6.77-3.753c-.237-.131-.385-.377-.385-.645V11.93c0-.268.148-.514.385-.645l6.77-3.753c.237-.132.534-.132.771 0l6.77 3.753c.237.131.385.377.385.645v7.532c0 .268-.148.514-.385.645l-6.77 3.753z"
        className="fill-primary-foreground"
      />

      {/* Decorative lines */}
      <path
        d="M23.116 11.93v7.532c0 .268-.148.514-.385.645l-6.77 3.753c-.237.132-.534.132-.771 0"
        className="stroke-primary-foreground/30"
        strokeWidth="0.5"
      />

      {/* RTL Arrow with enhanced styling */}
      <g className="stroke-primary">
        <path
          d="M19.5 13.5L16.5 21.5L13.5 13.5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-primary"
        />
        <path
          d="M13.5 13.5H19.5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-primary"
        />
      </g>

      {/* Subtle glow effect */}
      <circle
        cx="16"
        cy="16"
        r="12"
        className="stroke-primary-foreground/10"
        strokeWidth="0.5"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.1" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
