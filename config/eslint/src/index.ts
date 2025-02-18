import pluginJs from "@eslint/js";
import { Linter } from "eslint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export const eslintConfig: Linter.Config[] = [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "react/react-in-jsx-scope": "off",
    },
  },
] as Linter.Config[];

export default eslintConfig;
