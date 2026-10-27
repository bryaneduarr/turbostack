import { lstat } from "node:fs/promises";
import {
  exemptFileCountFolderPatterns,
  maximumFilesPerFolder,
} from "@workspace/rules/config/files/checked-files.config";
import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "folder-file-count";

function folderOf(path: string): string {
  const slash = path.lastIndexOf("/");
  return slash === -1 ? "" : path.slice(0, slash);
}

export const folderFileCountCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ rootPath, trackedPaths }) => {
    const regularPaths = (
      await Promise.all(
        trackedPaths.map(async (path) =>
          (await lstat(`${rootPath}/${path}`)).isSymbolicLink() ? null : path,
        ),
      )
    ).filter((path) => path !== null);

    const counts = new Map<string, number>();
    for (const path of regularPaths) {
      const folder = folderOf(path);
      counts.set(folder, (counts.get(folder) ?? 0) + 1);
    }

    const violations: RuleViolation[] = [];
    for (const [folder, count] of [...counts].sort(([left], [right]) =>
      left.localeCompare(right),
    )) {
      if (count <= maximumFilesPerFolder) continue;
      if (
        exemptFileCountFolderPatterns.some((pattern) => pattern.test(folder))
      ) {
        continue;
      }
      violations.push({
        ruleId,
        path: `${folder}/`,
        line: 1,
        message: `${count} files directly in this folder; keep at most ${maximumFilesPerFolder} and group them into descriptively named subfolders by responsibility.`,
      });
    }
    return violations;
  },
};
