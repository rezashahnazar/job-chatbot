import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    fontSize: {
      xs: [
        "0.75rem",
        {
          lineHeight: "1.5",
        },
      ],
      sm: [
        "0.875rem",
        {
          lineHeight: "1.6",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "1.75",
        },
      ],
      lg: [
        "1.125rem",
        {
          lineHeight: "1.8",
        },
      ],
      xl: [
        "1.25rem",
        {
          lineHeight: "1.8",
        },
      ],
      "2xl": [
        "1.5rem",
        {
          lineHeight: "1.85",
        },
      ],
      "3xl": [
        "1.875rem",
        {
          lineHeight: "1.85",
        },
      ],
      "4xl": [
        "2.25rem",
        {
          lineHeight: "1.75",
        },
      ],
      "5xl": [
        "3rem",
        {
          lineHeight: "1.5",
        },
      ],
      "6xl": [
        "3.75rem",
        {
          lineHeight: "1.4",
        },
      ],
    },
    extend: {
      screens: {
        "4xs": "300px",
        "3xs": "320px",
        "2xs": "375px",
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          main: "var(--main-surface-background)",
          message: "var(--message-surface)",
          sidebar: "var(--sidebar-surface)",
          "sidebar-floating": "var(--sidebar-surface-floating)",
        },
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          750: "var(--gray-750)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
          950: "var(--gray-950)",
        },
        brand: {
          purple: "var(--brand-purple)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-line": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "pulse-fade": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.9" },
        },
        "dot-bounce": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.6" },
          "40%": { transform: "translateY(-4px)", opacity: "1" },
        },
        thinking: {
          "0%, 100%": { opacity: "0.3", transform: "translateY(0)" },
          "50%": { opacity: "0.7", transform: "translateY(-0.3rem)" },
        },
        "spring-bounce": {
          "0%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "loading-bar": {
          "0%, 100%": { transform: "scaleX(0.25)", opacity: "0.5" },
          "50%": { transform: "scaleX(1)", opacity: "1" },
        },
        "gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        noise: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-5%)" },
          "20%": { transform: "translate(-10%,5%)" },
          "30%": { transform: "translate(5%,-10%)" },
          "40%": { transform: "translate(-5%,15%)" },
          "50%": { transform: "translate(-10%,5%)" },
          "60%": { transform: "translate(15%,0)" },
          "70%": { transform: "translate(0,10%)" },
          "80%": { transform: "translate(-15%,0)" },
          "90%": { transform: "translate(10%,5%)" },
        },
        "subtle-drift": {
          "0%": { transform: "translate(0,0) rotate(0deg)" },
          "25%": { transform: "translate(2px,2px) rotate(0.25deg)" },
          "50%": { transform: "translate(-2px,1px) rotate(-0.25deg)" },
          "75%": { transform: "translate(1px,-2px) rotate(0.25deg)" },
          "100%": { transform: "translate(0,0) rotate(0deg)" },
        },
        "pulse-slower": {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.99)" },
          "50%": { opacity: "0.8", transform: "scale(1.01)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-line": "pulse-line 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "pulse-fade": "pulse-fade 0.9s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "dot-bounce": "dot-bounce 1.4s ease-in-out infinite",
        thinking: "thinking 1.4s ease-in-out infinite",
        "spring-bounce":
          "spring-bounce var(--spring-bounce-duration) cubic-bezier(0.37, 0, 0.63, 1)",
        float: "float 1.5s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite",
        "loading-bar": "loading-bar 2s ease-in-out infinite",
        "gradient-move": "gradient-move 2s linear infinite",
        noise: "noise 8s steps(10) infinite",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "subtle-drift": "subtle-drift 20s ease-in-out infinite",
        "pulse-slower": "pulse-slower 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "bounce-slow": "bounce-slow 2s infinite",
      },
      perspective: {
        "1000": "1000px",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      translate: {
        "z-10": "10px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
