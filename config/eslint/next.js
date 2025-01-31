import pluginNext from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";

import baseConfig from "./base.js";

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export default [
  ...baseConfig,
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      // Spread Next.js rules
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,

      // Spread React.js rules
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];
