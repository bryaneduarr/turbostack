import type { FileRole } from "@workspace/rules/types/files/file-role.interface";

const roleFileNamePattern =
  /^(?<name>[a-z0-9]+(?:-[a-z0-9]+)*)\.(?<role>[a-z0-9]+)\.(?:ts|tsx|mts|cts)$/;

export function readFileRole(path: string): FileRole | null {
  const fileName = path.slice(path.lastIndexOf("/") + 1);
  const groups = roleFileNamePattern.exec(fileName)?.groups;
  if (groups === undefined) return null;
  const { name, role } = groups;
  if (name === undefined || role === undefined) return null;
  return { name, role };
}
