import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

const ruleId = "test-runner";

export const testRunnerCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) => /\.test\.tsx?$/.test(path),
  check: ({ path, text }) => {
    if (
      /from "bun:test"/.test(text) &&
      !/from "(vitest|jest|@jest\/globals)"/.test(text)
    ) {
      return [];
    }
    return [
      {
        ruleId,
        path,
        line: 1,
        message: 'Write unit tests with Bun\'s runner: import from "bun:test".',
      },
    ];
  },
};
