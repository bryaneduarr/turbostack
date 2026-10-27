import { createSourceFile } from "@workspace/rules/services/files/create-source-file.service";
import type { FileRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

export function readFlaggedLines(
  check: FileRuleCheck,
  path: string,
  text: string,
): number[] {
  return check.check(createSourceFile(path, text)).map(({ line }) => line);
}
