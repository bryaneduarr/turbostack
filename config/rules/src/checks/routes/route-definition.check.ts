import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "route-definition";

const requiredMembers = [
  "method",
  "path",
  "params",
  "query",
  "body",
  "response",
] as const;

const satisfiesPattern = /\}\s*as const satisfies RouteDefinition;/g;

export const routeDefinitionCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) => path.endsWith(".route.ts"),
  check: ({ path, text, lines }) => {
    const violations: RuleViolation[] = [];
    const definitions = text.match(satisfiesPattern)?.length ?? 0;
    if (definitions !== 1) {
      violations.push({
        ruleId,
        path,
        line: 1,
        message: `Declare exactly one route definition per file with "as const satisfies RouteDefinition"; found ${definitions}.`,
      });
    }

    for (const member of requiredMembers) {
      if (!lines.some((line) => line.startsWith(`  ${member}:`))) {
        violations.push({
          ruleId,
          path,
          line: 1,
          message: `Declare the "${member}" member; use null when the route does not consume it.`,
        });
      }
    }
    return violations;
  },
};
