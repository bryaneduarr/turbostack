import pluginReact from "eslint-plugin-react";

import baseConfig from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config} */
export default [
  ...baseConfig,
  {
    rules: {
      // Spread React and React-Hooks rules
      ...pluginReact.configs.recommended.rules,
    },
  },
];
