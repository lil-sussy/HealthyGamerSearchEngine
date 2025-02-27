import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        background: "#faf7fc",
        layer1: "#e7e1eb",
        layer2: "#d9d3e0",
        text: "#160e19",
        primary: "#9223c5",
        secondary: "#c482e3",
        accent: "#23C52A",
      },
    },
  },
  plugins: [],
} satisfies Config;
