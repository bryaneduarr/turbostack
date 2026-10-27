import type { RuleException } from "@workspace/rules/types/exceptions/rule-exception.interface";

// Every entry needs a reviewed reason; prefer fixing the file over adding one.
export const ruleExceptions: readonly RuleException[] = [
  {
    ruleId: "file-name",
    path: "apps/server/src/index.ts",
    reason:
      "Server runtime entrypoint started by the build, dev, and Docker commands.",
  },
  {
    ruleId: "file-length",
    path: "packages/utils/src/http/status-codes/http-status-code.constant.ts",
    reason: "The single canonical HTTP status catalog must stay in one file.",
  },
  {
    ruleId: "comment-style",
    path: "packages/utils/src/http/status-codes/http-status-code.constant.ts",
    reason:
      "Comments preserve the generated upstream status snapshot verbatim.",
  },
  {
    ruleId: "type-placement",
    path: "scripts/verify-workspace.script.ts",
    reason:
      "Root scripts are standalone files with no package alias to import a types/ file through.",
  },
];
