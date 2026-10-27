import { rolePlacements } from "@workspace/rules/config/placement/role-placement.config";
import { readFileRole } from "@workspace/rules/services/files/read-file-role.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

const ruleId = "role-placement";

export const rolePlacementCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: () => true,
  check: ({ path }) => {
    const fileRole = readFileRole(path);
    if (fileRole === null) return [];
    const allowedRoots = rolePlacements.get(fileRole.role);
    if (allowedRoots === undefined) return [];
    if (allowedRoots.some((root) => root.test(path))) return [];

    return [
      {
        ruleId,
        path,
        line: 1,
        message: `.${fileRole.role} files belong under ${allowedRoots.map((root) => root.source).join(" or ")}.`,
      },
    ];
  },
};
