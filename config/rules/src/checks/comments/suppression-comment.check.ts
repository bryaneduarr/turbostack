import { testFilePattern } from "@workspace/rules/config/files/checked-files.config";
import { findSourceComments } from "@workspace/rules/services/comments/find-source-comments.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "suppression";

const protectedRulePattern =
  /biome-ignore[\w-]*\s+lint\/(style\/noRestrictedImports|suspicious\/noDeprecatedImports|suspicious\/noExplicitAny|style\/noNonNullAssertion)/;

export const suppressionCommentCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: () => true,
  check: ({ path, text }) => {
    const violations: RuleViolation[] = [];
    for (const comment of findSourceComments(text)) {
      const line = comment.startLine;
      if (protectedRulePattern.test(comment.text)) {
        violations.push({
          ruleId,
          path,
          line,
          message:
            "Do not suppress import, deprecation, any, or non-null assertion rules; fix the code instead.",
        });
      }
      if (/biome-ignore-(all|start|end)\b/.test(comment.text)) {
        violations.push({
          ruleId,
          path,
          line,
          message:
            "Suppress one reviewed line with biome-ignore and a reason, not a file or range.",
        });
      }
      if (/@ts-(ignore|nocheck)\b/.test(comment.text)) {
        violations.push({
          ruleId,
          path,
          line,
          message: "Correct the type instead of suppressing TypeScript.",
        });
      }
      if (
        /@ts-expect-error\b/.test(comment.text) &&
        !testFilePattern.test(path)
      ) {
        violations.push({
          ruleId,
          path,
          line,
          message:
            "@ts-expect-error is only for type-level tests; correct the source type.",
        });
      }
    }
    return violations;
  },
};
