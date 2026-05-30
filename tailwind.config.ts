import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        soc: {
          bg: "#09090b",
          panel: "#0c0c0f",
          elevated: "#111114",
          line: "#27272a",
          muted: "#a1a1aa",
          safe: "#10b981",
          warn: "#f59e0b",
          critical: "#fb274c",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      boxShadow: {
        none: "none",
      },
    },
  },
};

export default config;
