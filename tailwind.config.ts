import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import config2 from "./src/styles/tailwind.config.ts";

export default {
  ...config2,
} satisfies Config;
