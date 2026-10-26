import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "alias-export";

const aliasExportPattern = /^export const (\w+) = ([A-Za-z_$][\w$]*);\s*$/;

const literalKeywords: ReadonlySet<string> = new Set([
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
]);

export const aliasExportCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: () => true,
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    lines.forEach((line, index) => {
      const match = aliasExportPattern.exec(line);
      if (match === null) return;
      const [, alias, target] = match;
      if (target === undefined || literalKeywords.has(target)) return;
      violations.push({
        ruleId,
        path,
        line: index + 1,
        message: `"${alias}" only aliases "${target}"; import "${target}" from its owner instead of exporting a second name.`,
      });
    });
    return violations;
  },
};
