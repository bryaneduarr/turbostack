import {
  testFilePattern,
  testSupportPattern,
} from "@workspace/rules/config/files/checked-files.config";

export function isProductionSourcePath(path: string): boolean {
  return !testFilePattern.test(path) && !testSupportPattern.test(path);
}
