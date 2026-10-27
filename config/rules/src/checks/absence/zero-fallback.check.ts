import { isProductionSourcePath } from "@workspace/rules/services/files/is-production-source-path.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "zero-fallback";

const serverSourcePattern = /^apps\/server\/src\//;
const zeroFallbackPatterns: readonly RegExp[] = [
  /\?\? 0(?![\w.])/,
  /\b(\w+) === undefined \? 0 : \1\./,
];

export const zeroFallbackCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) =>
    serverSourcePattern.test(path) && isProductionSourcePath(path),
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    lines.forEach((line, index) => {
      if (!zeroFallbackPatterns.some((pattern) => pattern.test(line))) return;
      violations.push({
        ruleId,
        path,
        line: index + 1,
        message:
          "Do not stand in 0 for a missing row or value; read aggregate rows with readAggregateRow, or handle the absence explicitly.",
      });
    });
    return violations;
  },
};
