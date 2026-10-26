import { maximumSourceLines } from "@workspace/rules/config/files/checked-files.config";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

const ruleId = "file-length";

export const fileLengthCheck: FileRuleCheck = {
  scope: "file",
  ruleId,
  appliesTo: (path) => !path.endsWith(".d.ts"),
  check: ({ path, text, lines }) => {
    const lineCount = text.endsWith("\n") ? lines.length - 1 : lines.length;
    if (lineCount <= maximumSourceLines) return [];

    return [
      {
        ruleId,
        path,
        line: maximumSourceLines + 1,
        message: `${lineCount} lines; split responsibilities into focused files of at most ${maximumSourceLines} lines.`,
      },
    ];
  },
};
