import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "folder-name";

const kebabCasePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const toolFolderNames = new Set(["__snapshots__"]);

// Dynamic segments, route groups, parallel routes, and private folders.
const nextSegmentPattern =
  /^(\[{1,2}(\.\.\.)?[a-zA-Z]+\]{1,2}|\([a-z0-9-]+\)|@[a-z0-9-]+|_[a-z0-9-]+)$/;

const forbiddenFolderMessages: ReadonlyMap<string, string> = new Map([
  ["shared", "Do not create shared/ folders; use a specifically named owner."],
  ["common", "Do not create common/ folders; use a specifically named owner."],
  ["misc", "Do not create catch-all folders; use a specifically named owner."],
  ["tests", "Keep tests next to the code they cover."],
  ["__tests__", "Keep tests next to the code they cover."],
]);

function checkSegment(folderPath: string, segment: string): string | null {
  const forbidden = forbiddenFolderMessages.get(segment);
  if (forbidden !== undefined) return forbidden;
  if (kebabCasePattern.test(segment) || toolFolderNames.has(segment)) {
    return null;
  }
  if (folderPath.includes("/src/app/") && nextSegmentPattern.test(segment)) {
    return null;
  }
  return `Folder "${segment}" must be descriptive kebab-case.`;
}

export const folderNameCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ trackedPaths }) => {
    const folders = new Set<string>();
    for (const path of trackedPaths) {
      const sourceStart = path.indexOf("/src/");
      if (sourceStart === -1) continue;
      const sourceRoot = path.slice(0, sourceStart + "/src".length);
      const segments = path
        .slice(sourceStart + "/src/".length)
        .split("/")
        .slice(0, -1);
      segments.forEach((_, index) => {
        folders.add(`${sourceRoot}/${segments.slice(0, index + 1).join("/")}`);
      });
    }

    const violations: RuleViolation[] = [];
    for (const folderPath of [...folders].sort()) {
      const segment = folderPath.slice(folderPath.lastIndexOf("/") + 1);
      const message = checkSegment(`${folderPath}/`, segment);
      if (message !== null) {
        violations.push({ ruleId, path: `${folderPath}/`, line: 1, message });
      }
    }
    return violations;
  },
};
