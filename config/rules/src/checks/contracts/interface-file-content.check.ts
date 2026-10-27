import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "interface-content";

const runtimeExportPattern =
  /^export\s+(default\b|const\b|let\b|var\b|function\b|async\b|class\b|enum\b|abstract\b)/;

const valueImportPattern = /^import\s+(?!type\b)/;

export const interfaceFileContentCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) => path.endsWith(".interface.ts"),
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    lines.forEach((line, index) => {
      if (runtimeExportPattern.test(line)) {
        violations.push({
          ruleId,
          path,
          line: index + 1,
          message:
            "Interface files contain only type contracts; move runtime values to their own role file.",
        });
      } else if (valueImportPattern.test(line)) {
        violations.push({
          ruleId,
          path,
          line: index + 1,
          message:
            "Interface files reference schemas and other modules with type-only imports.",
        });
      }
    });
    return violations;
  },
};
