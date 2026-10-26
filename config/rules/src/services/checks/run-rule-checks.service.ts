import { enabledChecks } from "@workspace/rules/config/checks/enabled-checks.config";
import { isExceptedViolation } from "@workspace/rules/services/exceptions/is-excepted-violation.service";
import { createSourceFile } from "@workspace/rules/services/files/create-source-file.service";
import { isCheckedSourceFile } from "@workspace/rules/services/files/is-checked-source-file.service";
import { listTrackedFiles } from "@workspace/rules/services/files/list-tracked-files.service";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";
import type { SourceFile } from "@workspace/rules/types/files/source-file.interface";

async function readSourceFile(
  rootPath: string,
  path: string,
): Promise<SourceFile> {
  return createSourceFile(path, await Bun.file(`${rootPath}/${path}`).text());
}

export async function runRuleChecks(
  rootPath: string,
): Promise<RuleViolation[]> {
  const trackedPaths = await listTrackedFiles(rootPath);
  const sourceFiles = await Promise.all(
    trackedPaths
      .filter(isCheckedSourceFile)
      .map((path) => readSourceFile(rootPath, path)),
  );

  const violations: RuleViolation[] = [];
  for (const ruleCheck of enabledChecks) {
    if (ruleCheck.scope === "repository") {
      violations.push(...(await ruleCheck.check({ rootPath, trackedPaths })));
      continue;
    }
    for (const file of sourceFiles) {
      if (ruleCheck.appliesTo(file.path)) {
        violations.push(...ruleCheck.check(file));
      }
    }
  }

  return violations
    .filter((violation) => !isExceptedViolation(violation))
    .sort((left, right) =>
      left.path === right.path
        ? left.line - right.line
        : left.path.localeCompare(right.path),
    );
}
