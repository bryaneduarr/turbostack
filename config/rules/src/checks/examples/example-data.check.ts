import { testFilePattern } from "@workspace/rules/config/files/checked-files.config";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "example-data";

const emailPattern =
  /[A-Za-z0-9._%+-]+@((?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,})(?![\w.-])/g;

// Reserved by RFC 2606 and RFC 6762, so these never reach a real mailbox.
const reservedEmailDomainPattern =
  /(^|\.)(example\.(com|org|net)|example|test|invalid|localhost|local)$/i;

const uuidPattern =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i;

export const exampleDataCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: () => true,
  check: ({ path, lines }) => {
    const violations: RuleViolation[] = [];
    lines.forEach((line, index) => {
      for (const [, domain] of line.matchAll(emailPattern)) {
        if (domain === undefined || reservedEmailDomainPattern.test(domain)) {
          continue;
        }
        violations.push({
          ruleId,
          path,
          line: index + 1,
          message: `Use a reserved example address such as example@example.com instead of one at ${domain}.`,
        });
      }
      if (!testFilePattern.test(path) && uuidPattern.test(line)) {
        violations.push({
          ruleId,
          path,
          line: index + 1,
          message: "Do not hardcode identifiers; generate or look them up.",
        });
      }
    });
    return violations;
  },
};
