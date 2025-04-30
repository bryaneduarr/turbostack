import eslintConfig from "@workspace/eslint/index";

export default [
  ...eslintConfig,
  {
    files: ["**/*.{ts}"],
    ignores: ["dist", "node_modules"],
  },
];
