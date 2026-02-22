import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cloud: "#f7faff",
        surface: "#ffffff",
        ink: "#0b132b",
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          300: "#7dd3fc",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        glow: "#5aa6ff",
      },
      boxShadow: {
        neon: "0 10px 30px rgba(37, 99, 235, 0.2)",
        neonStrong: "0 20px 40px rgba(37, 99, 235, 0.35)",
      },
      fontSize: {
        mega: ["clamp(2.4rem, 4vw, 4.2rem)", { lineHeight: "1.05" }],
        hero: ["clamp(1.8rem, 3.2vw, 3rem)", { lineHeight: "1.1" }],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 60%)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
