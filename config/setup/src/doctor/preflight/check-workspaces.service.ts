import path from "node:path";

import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");
const packageFolderPatterns = [
  "*/package.json",
  "*/*/package.json",
  "*/*/*/package.json",
];
// Mirrors the dependency and build-output entries in .gitignore.
const ignoredPackageFolders = new Set([
  "node_modules",
  ".next",
  ".turbo",
  ".vercel",
  "out",
  "build",
  "dist",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isLiteralFolder = (glob: string) => !glob.includes("*");

const isIgnoredPackagePath = (packagePath: string) =>
  packagePath.split("/").some((segment) => ignoredPackageFolders.has(segment));

function readWorkspaceGlobs(manifest: unknown): string[] {
  const workspaces: unknown = isRecord(manifest)
    ? manifest.workspaces
    : undefined;
  if (!Array.isArray(workspaces) || !workspaces.every(isString)) {
    throw new Error("package.json workspaces must be a list of folder globs.");
  }
  return workspaces;
}

async function findPackageFolders(root: string): Promise<string[]> {
  const folders: string[] = [];
  for (const pattern of packageFolderPatterns) {
    const scan = new Bun.Glob(pattern).scan({
      cwd: root,
      dot: true,
    });
    for await (const packagePath of scan) {
      if (isIgnoredPackagePath(packagePath)) continue;
      folders.push(path.dirname(packagePath));
    }
  }
  return folders;
}

export async function checkWorkspaces(
  root = repositoryRoot,
): Promise<readonly DoctorFailure[]> {
  const manifest: unknown = await Bun.file(
    path.join(root, "package.json"),
  ).json();
  const globs = readWorkspaceGlobs(manifest);
  const failures: DoctorFailure[] = [];

  for (const folder of globs.filter(isLiteralFolder)) {
    const manifestFile = Bun.file(path.join(root, folder, "package.json"));
    if (!(await manifestFile.exists())) {
      failures.push({
        summary: `Workspace ${folder} is listed but missing`,
        reason: "package.json lists a folder that is not on disk",
        fix: "bun install",
      });
    }
  }

  for (const folder of await findPackageFolders(root)) {
    const isCovered = globs.some((glob) => new Bun.Glob(glob).match(folder));
    if (!isCovered) {
      failures.push({
        summary: `Workspace ${folder} is not covered by package.json`,
        reason: "bun install does not link a package that no workspace matches",
        fix: `add "${folder}" to the workspaces list in package.json`,
      });
    }
  }
  return failures;
}
