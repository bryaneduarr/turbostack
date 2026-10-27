import { isProductionSourcePath } from "@workspace/rules/services/files/is-production-source-path.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "optional-chaining";

const allowedCallPattern = /\.(exec|match|get)$/;
const stringLiteralPattern = /(["'`])(?:\\.|(?!\1).)*\1/g;

function findOpeningParenthesis(line: string, closingIndex: number) {
  let depth = 0;

  for (let index = closingIndex; index >= 0; index -= 1) {
    if (line[index] === ")") depth += 1;
    if (line[index] === "(") depth -= 1;
    if (depth === 0) return index;
  }

  return -1;
}

function isAllowedReceiver(line: string, chainIndex: number) {
  const previous = line[chainIndex - 1];
  if (previous === "]") return true;
  if (previous !== ")") return false;

  const opening = findOpeningParenthesis(line, chainIndex - 1);
  return opening > 0 && allowedCallPattern.test(line.slice(0, opening));
}

export const optionalChainingCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: isProductionSourcePath,
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    lines.forEach((sourceLine, index) => {
      const line = sourceLine.replace(stringLiteralPattern, (literal) =>
        " ".repeat(literal.length),
      );
      const chains = [...line.matchAll(/\?\.(?!\d)/g)];
      if (chains.every((chain) => isAllowedReceiver(line, chain.index))) {
        return;
      }
      violations.push({
        ruleId,
        path,
        line: index + 1,
        message:
          "Use ?. only after a regex result (.exec, .match), a Map .get, or an index access; otherwise narrow the value with an explicit check.",
      });
    });
    return violations;
  },
};
