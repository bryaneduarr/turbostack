import { fileURLToPath } from "url";

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
export default {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<TYPES>",
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "^(expo(.*)$)|^(expo$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@repo",
    "^@repo/(.*)$",
    "",
    "<TYPES>^[.|..|~]",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  tailwindStylesheet: fileURLToPath(
    new URL("../../config/tailwind/globals.css", import.meta.url),
  ),
  tailwindConfig: fileURLToPath(
    new URL("../../packages/ui/tailwind.config.ts", import.meta.url),
  ),
  tailwindPreserveWhitespace: false,
  tailwindPreserveDuplicates: false,
  tailwindFunctions: ["cn"],
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "all",
  endOfLine: "auto",
  singleQuote: false,
};
