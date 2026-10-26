import {
  testFilePattern,
  typeDeclarationPattern,
} from "@workspace/rules/config/files/checked-files.config";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "type-placement";

export const typeDeclarationPlacementCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) =>
    !path.endsWith(".interface.ts") &&
    !path.endsWith(".d.ts") &&
    !testFilePattern.test(path),
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    lines.forEach((line, index) => {
      if (!typeDeclarationPattern.test(line)) return;
      violations.push({
        ruleId,
        path,
        line: index + 1,
        message:
          "Declare interfaces and types in a responsibility-specific .interface.ts file under packages/schemas/src/ or the package's types/ root.",
      });
    });
    return violations;
  },
};
