import {
  maximumTestTypeLines,
  testFilePattern,
  typeDeclarationPattern,
} from "@workspace/rules/config/files/checked-files.config";
import { isCheckedSourceFile } from "@workspace/rules/services/files/is-checked-source-file.service";
import { measureDeclarationLines } from "@workspace/rules/services/files/measure-declaration-lines.service";
import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";
import type { TestLocalType } from "@workspace/rules/types/files/test-local-type.interface";

const ruleId = "test-local-types";

async function findTestLocalTypes(
  rootPath: string,
  path: string,
): Promise<TestLocalType[]> {
  const lines = (await Bun.file(`${rootPath}/${path}`).text()).split("\n");
  return lines.flatMap((line, index) => {
    const name = typeDeclarationPattern.exec(line)?.[4];
    if (name === undefined) return [];
    return [
      {
        path,
        line: index + 1,
        name,
        lineCount: measureDeclarationLines(lines, index),
      },
    ];
  });
}

// Tests may keep small helper types unique to them; reused or large types
// belong in an .interface.ts file under the package's types/ root.
export const testLocalTypesCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ rootPath, trackedPaths }) => {
    const testPaths = trackedPaths.filter(
      (path) => isCheckedSourceFile(path) && testFilePattern.test(path),
    );
    const types = (
      await Promise.all(
        testPaths.map((path) => findTestLocalTypes(rootPath, path)),
      )
    ).flat();

    const pathsByName = new Map<string, Set<string>>();
    for (const { name, path } of types) {
      pathsByName.set(name, (pathsByName.get(name) ?? new Set()).add(path));
    }

    const violations: RuleViolation[] = [];
    for (const { path, line, name, lineCount } of types) {
      const declaringPaths = pathsByName.get(name)?.size ?? 0;
      if (declaringPaths > 1) {
        violations.push({
          ruleId,
          path,
          line,
          message: `${name} is declared in ${declaringPaths} test files; move it to one .interface.ts file under types/.`,
        });
      }
      if (lineCount > maximumTestTypeLines) {
        violations.push({
          ruleId,
          path,
          line,
          message: `${name} spans ${lineCount} lines; move large test types to an .interface.ts file under types/.`,
        });
      }
    }
    return violations;
  },
};
