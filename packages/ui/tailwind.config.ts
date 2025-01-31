import type { Config } from "tailwindcss";
import tailwindCofig from "@workspace/tailwind/tailwind.config";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  ...tailwindCofig,
  plugins: [tailwindcssAnimate],
} satisfies Config;
