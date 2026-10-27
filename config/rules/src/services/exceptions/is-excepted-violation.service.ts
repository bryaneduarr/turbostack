import { ruleExceptions } from "@workspace/rules/config/exceptions/rule-exceptions.config";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";
import type { RuleException } from "@workspace/rules/types/exceptions/rule-exception.interface";

export function isExceptedViolation(
  { ruleId, path }: RuleViolation,
  exceptions: readonly RuleException[] = ruleExceptions,
): boolean {
  return exceptions.some(
    (exception) => exception.ruleId === ruleId && exception.path === path,
  );
}
