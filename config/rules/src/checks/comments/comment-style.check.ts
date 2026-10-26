import { findSourceComments } from "@workspace/rules/services/comments/find-source-comments.service";
import { groupLineComments } from "@workspace/rules/services/comments/group-line-comments.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "comment-style";

const styleProblems: readonly { pattern: RegExp; message: string }[] = [
  {
    pattern: /^\s*\*?\s*(why|what)\s*:/i,
    message: "Do not prefix comments with Why: or What:.",
  },
  {
    pattern: /^\s*(step\s*)?\d+[.)]\s/i,
    message: "Do not write numbered step comments.",
  },
  {
    pattern: /([-=_#~])\1{2,}|[━─═]/,
    message: "Do not use decorative separators in comments.",
  },
  {
    pattern: /[^\t\n\r -~]/,
    message:
      "Use plain keyboard characters in comments, not em dashes or Unicode.",
  },
  {
    pattern: /human[- ](readable|friendly|like)/i,
    message:
      'Do not mention "human readable", "human friendly", or "human-like".',
  },
  {
    pattern: /\b(you|your|yours|yourself)\b/i,
    message: "Avoid pronouns addressing the reader.",
  },
];

const directivePattern =
  /^\s*(biome-ignore|@ts-|eslint-|prettier-|#region|#endregion|@vitest|istanbul|c8 )/;

const sentenceEndPattern = /[.?!:)`"']$/;

export const commentStyleCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: () => true,
  check: ({ path, text }) => {
    const violations: RuleViolation[] = [];
    for (const comment of groupLineComments(findSourceComments(text))) {
      const commentLines = comment.text.split("\n");
      commentLines.forEach((commentLine, offset) => {
        if (directivePattern.test(commentLine)) return;
        for (const { pattern, message } of styleProblems) {
          if (pattern.test(commentLine)) {
            const line = comment.startLine + offset;
            violations.push({ ruleId, path, line, message });
          }
        }
      });

      const lastLine = commentLines.at(-1) ?? "";
      const ending = comment.text.replace(/\s*\*?\s*$/, "").trimEnd();
      if (
        !directivePattern.test(lastLine) &&
        ending !== "" &&
        !sentenceEndPattern.test(ending)
      ) {
        violations.push({
          ruleId,
          path,
          line: comment.endLine,
          message: "End complete comment sentences with a period.",
        });
      }
    }
    return violations;
  },
};
