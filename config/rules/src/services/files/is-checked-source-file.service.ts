import {
  ignoredPathPatterns,
  sourceFilePattern,
  sourceRootPattern,
} from "@workspace/rules/config/files/checked-files.config";

export function isCheckedSourceFile(path: string): boolean {
  return (
    sourceFilePattern.test(path) &&
    sourceRootPattern.test(path) &&
    !ignoredPathPatterns.some((pattern) => pattern.test(path))
  );
}
