import {
  fileRoles,
  nextAppFileNames,
  nextAppPattern,
  nextRootFileNames,
  nextRootPattern,
} from "@workspace/rules/config/naming/file-roles.config";
import { readFileRole } from "@workspace/rules/services/files/read-file-role.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

const ruleId = "file-name";

const vagueNames = new Set([
  "common",
  "helper",
  "helpers",
  "index",
  "misc",
  "shared",
  "types",
  "util",
  "utils",
]);

const declarationFileNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.d\.ts$/;

function isFrameworkFile(path: string): boolean {
  const fileName = path.slice(path.lastIndexOf("/") + 1);
  if (declarationFileNamePattern.test(fileName)) return true;
  if (nextAppPattern.test(path)) return nextAppFileNames.has(fileName);
  if (nextRootPattern.test(path)) return nextRootFileNames.has(fileName);
  return false;
}

export const fileNameCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: () => true,
  check: ({ path }) => {
    if (isFrameworkFile(path)) return [];
    const fileRole = readFileRole(path);

    if (fileRole === null) {
      return [
        {
          ruleId,
          path,
          line: 1,
          message:
            "Name the file <specific-responsibility>.<singular-role>.ts in kebab-case, such as sign-in.handler.ts.",
        },
      ];
    }
    if (!fileRoles.has(fileRole.role)) {
      return [
        {
          ruleId,
          path,
          line: 1,
          message: `Unknown role ".${fileRole.role}". Use one of: ${[...fileRoles].join(", ")}.`,
        },
      ];
    }
    if (vagueNames.has(fileRole.name)) {
      return [
        {
          ruleId,
          path,
          line: 1,
          message: `"${fileRole.name}" is a vague name; name the concrete responsibility.`,
        },
      ];
    }
    return [];
  },
};
