import { eslintConfig } from "@workspace/eslint/index";

export default [
  ...eslintConfig,
  {
    ignores: ["app/**", "packages/**"],
  },
];
