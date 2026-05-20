import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080808",
        surface: "#0f0f0f",
        "surface-2": "#161616",
        "text-main": "#efefef",
        "text-2": "#888888",
        "text-3": "#444444",
        line: "#1c1c1c",
        "line-2": "#2a2a2a",
        day1: "#22c55e",
        day2: "#60a5fa",
        day3: "#fbbf24",
        danger: "#ef4444",
      },
      maxWidth: { app: "430px" },
      height: { btn: "52px" },
      fontFamily: {
        mono: ["Space Mono", "Courier New", "monospace"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "sans-serif"],
      },
      letterSpacing: {
        label: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
