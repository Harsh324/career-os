import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        gh: {
          canvas: {
            DEFAULT: "#ffffff",
            dark: "#0d1117",
          },
          surface: {
            DEFAULT: "#f6f8fa",
            dark: "#161b22",
          },
          border: {
            DEFAULT: "#d0d7de",
            dark: "#30363d",
          },
          accent: {
            DEFAULT: "#0969da",
            dark: "#58a6ff",
          },
          success: {
            DEFAULT: "#1f883d",
            dark: "#39d353",
          },
          text: {
            primary: {
              DEFAULT: "#24292f",
              dark: "#f0f6fc",
            },
            secondary: {
              DEFAULT: "#57606a",
              dark: "#8b949e",
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
