import { describeMissingDocumentation } from "@workspace/rules/services/comments/describe-missing-documentation.service";
import { readCommentAbove } from "@workspace/rules/services/comments/read-comment-above.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "schema-documentation";

const objectOpeningPattern =
  /(z\.(object|strictObject|looseObject)|\.(extend|safeExtend))\(\{$/;

const inlineObjectPattern =
  /(z\.(object|strictObject|looseObject)|\.(extend|safeExtend))\(\{\s*[^\s}]/;

const fieldPattern = /^\s*([A-Za-z_$][\w$]*|"[^"]+"|\[[^\]]+\])(\??:|,$)/;

function indentationOf(line: string): number {
  return line.length - line.trimStart().length;
}

// Biome formats each documented field on its own line, so an object written
// on one line cannot carry the required field comments.
export const schemaFieldDocumentationCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) => path.endsWith(".schema.ts"),
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    const openObjects: number[] = [];

    lines.forEach((line, index) => {
      const fieldIndentation = openObjects.at(-1);
      if (
        fieldIndentation !== undefined &&
        indentationOf(line) === fieldIndentation - 2 &&
        line.trimStart().startsWith("}")
      ) {
        openObjects.pop();
      } else if (
        fieldIndentation !== undefined &&
        indentationOf(line) === fieldIndentation
      ) {
        const field = fieldPattern.exec(line);
        const message =
          field === null
            ? null
            : describeMissingDocumentation(
                readCommentAbove(lines, index),
                `schema field ${field[1]}`,
              );
        if (message !== null) {
          violations.push({ ruleId, path, line: index + 1, message });
        }
      }

      if (objectOpeningPattern.test(line.trimEnd())) {
        openObjects.push(indentationOf(line) + 2);
      } else if (inlineObjectPattern.test(line)) {
        violations.push({
          ruleId,
          path,
          line: index + 1,
          message:
            "Write each object schema field on its own line with a /** ... */ JSDoc comment above it.",
        });
      }
    });
    return violations;
  },
};
