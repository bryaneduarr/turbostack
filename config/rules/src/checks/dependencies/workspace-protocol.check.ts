import { readPackageDependencies } from "@workspace/rules/services/files/read-package-dependencies.service";
import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "workspace-protocol";

export const workspaceProtocolCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ rootPath, trackedPaths }) => {
    const violations: RuleViolation[] = [];
    const manifests = trackedPaths.filter(
      (path) => path === "package.json" || path.endsWith("/package.json"),
    );

    for (const path of manifests) {
      const dependencies = await readPackageDependencies(`${rootPath}/${path}`);
      for (const [name, version] of dependencies) {
        if (!name.startsWith("@workspace/") || version === "workspace:*") {
          continue;
        }
        violations.push({
          ruleId,
          path,
          line: 1,
          message: `Declare "${name}" as "workspace:*", not "${version}".`,
        });
      }
    }
    return violations;
  },
};
