import { describeMissingDocumentation } from "@workspace/rules/services/comments/describe-missing-documentation.service";
import { readCommentAbove } from "@workspace/rules/services/comments/read-comment-above.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "interface-documentation";

const declarationPattern = /^export\s+(interface|type)\s+(\w+)/;

const memberPattern =
  /^ {2}(readonly\s+)?([A-Za-z_$][\w$]*|"[^"]+"|\[[^\]]+\])\??\s*[:(<]/;

export const interfaceDocumentationCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) => path.endsWith(".interface.ts"),
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    const report = (index: number, subject: string) => {
      const message = describeMissingDocumentation(
        readCommentAbove(lines, index),
        subject,
      );
      if (message !== null) {
        violations.push({ ruleId, path, line: index + 1, message });
      }
    };

    let insideInterface = false;
    lines.forEach((line, index) => {
      const declaration = declarationPattern.exec(line);
      if (declaration !== null) {
        report(index, `${declaration[2]}`);
        insideInterface =
          declaration[1] === "interface" && !line.trimEnd().endsWith("{}");
        return;
      }
      if (!insideInterface) return;
      if (line.startsWith("}")) {
        insideInterface = false;
        return;
      }
      const member = memberPattern.exec(line);
      if (member !== null) report(index, `member ${member[2]}`);
    });
    return violations;
  },
};
