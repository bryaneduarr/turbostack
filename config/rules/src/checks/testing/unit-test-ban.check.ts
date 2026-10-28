import { unitTestFilePattern } from "@workspace/rules/config/files/checked-files.config";
import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

const ruleId = "unit-test-ban";

export const unitTestBanCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ trackedPaths }) =>
    trackedPaths
      .filter((path) => unitTestFilePattern.test(path))
      .map((path) => ({
        ruleId,
        path,
        line: 1,
        message:
          "Unit tests are not used; write a browser test (*.e2e.ts) instead.",
      })),
};
