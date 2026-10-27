import { readPackageDependencies } from "@workspace/rules/services/files/read-package-dependencies.service";
import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "root-dependencies";

const allowedRootDependencies = new Set([
  "@workspace/biome",
  "@workspace/typescript",
  "turbo",
]);

export const rootDependenciesCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ rootPath }) => {
    const violations: RuleViolation[] = [];
    const dependencies = await readPackageDependencies(
      `${rootPath}/package.json`,
    );
    for (const name of dependencies.keys()) {
      if (allowedRootDependencies.has(name)) continue;
      violations.push({
        ruleId,
        path: "package.json",
        line: 1,
        message: `Root dependencies are limited to ${[...allowedRootDependencies].join(", ")}; move "${name}" to the workspace package that owns it.`,
      });
    }
    return violations;
  },
};
