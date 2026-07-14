import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: "#5D4037",
          cream: "#FFF8E1",
          olive: "#6B8E23",
          sand: "#F7F0E3",
          stone: "#E7DDCF"
        }
      },
      boxShadow: {
        soft: "0 18px 48px rgba(93, 64, 55, 0.12)"
      },
      borderRadius: {
        xl: "1rem"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-grain":
          "radial-gradient(circle at top left, rgba(107, 142, 35, 0.22), transparent 35%), radial-gradient(circle at bottom right, rgba(93, 64, 55, 0.18), transparent 40%)"
      }
    }
  },
  plugins: []
};

export default config;

