import pluginJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { Linter } from "eslint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
// @ts-expect-error No types for eslint-plugin-next.
import pluginNext from "@next/eslint-plugin-next";

export const eslintConfig: Linter.Config[] = [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": pluginNext,
      react: pluginReact,
      turbo: turboPlugin,
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],

      // React rules
      ...pluginReact.configs.recommended.rules,

      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  // General
  {
    settings: { react: { version: "19" } },
  },
  {
    ignores: ["dist", "pnpm-lock.yaml", ".next"],
  },
] as Linter.Config[];

export default eslintConfig;
