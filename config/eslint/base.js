import js from "@eslint/js";
import tseslintParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export default [
  // Configuration
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      parser: tseslintParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  // Plugins / Rules
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      prettier: prettierPlugin,
      turbo: turboPlugin,
      react: pluginReact,
    },
    rules: {
      // Custom rules
      semi: ["error", "always"],
      quotes: ["error", "double"],

      // Spread React.js rules
      ...pluginReactHooks.configs.recommended.rules,

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
    ignores: [
      "**/*.config.js",
      "**/*.config.cjs",
      "**/.eslintrc.cjs",
      ".next",
      "dist",
      "pnpm-lock.yaml",
    ],
  },
];
