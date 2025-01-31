import eslintConfig from "@workspace/eslint/base";

export default [
  ...eslintConfig,
  {
    ignores: ["apps/**", "packages/**"],
  },
];
