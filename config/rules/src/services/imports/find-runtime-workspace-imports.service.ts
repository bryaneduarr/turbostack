import { createLineLocator } from "@workspace/rules/services/files/create-line-locator.service";
import type { WorkspaceImport } from "@workspace/rules/types/imports/workspace-import.interface";

const staticImportPattern =
  /^(?:import|export)\s+(type\s+)?(?:[^"';]*?\bfrom\s+)?"(@workspace\/[\w-]+)(?:\/[^"]*)?"/gm;
const dynamicImportPattern = /\bimport\(\s*"(@workspace\/[\w-]+)(?:\/[^"]*)?"/g;

export function findRuntimeWorkspaceImports(text: string): WorkspaceImport[] {
  const locateLine = createLineLocator(text);
  const imports: WorkspaceImport[] = [];

  for (const match of text.matchAll(staticImportPattern)) {
    const [, typeOnly, packageName] = match;
    if (typeOnly !== undefined || packageName === undefined) continue;
    imports.push({ packageName, line: locateLine(match.index) });
  }
  for (const match of text.matchAll(dynamicImportPattern)) {
    const [, packageName] = match;
    if (packageName === undefined) continue;
    imports.push({ packageName, line: locateLine(match.index) });
  }

  return imports;
}
