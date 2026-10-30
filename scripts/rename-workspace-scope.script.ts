import { lstatSync } from "node:fs";

const NEW_SCOPE = "workspace";
const NEW_CONTAINER_PREFIX = "app";

const npmScopePattern = /^[a-z0-9][a-z0-9._-]*$/;
const containerPrefixPattern = /^[a-z0-9][a-z0-9-]*$/;
const prefixAssignmentPattern = /^PROJECT_PREFIX=([a-z0-9][a-z0-9-]*)$/m;
const prefixFile = "scripts/dc-lib/names.sh";
const containerNameSuffixes = [
  "devcontainer",
  "workspace",
  "bun-cache",
  "playwright-browsers",
];
const configPackagePattern = /^@([a-z0-9][a-z0-9._-]*)\/biome$/;

function readCurrentScope(manifest: unknown): string {
  if (
    typeof manifest !== "object" ||
    manifest === null ||
    !("devDependencies" in manifest) ||
    typeof manifest.devDependencies !== "object" ||
    manifest.devDependencies === null
  ) {
    throw new Error("The root package.json has no devDependencies.");
  }

  for (const name of Object.keys(manifest.devDependencies)) {
    const scope = configPackagePattern.exec(name)?.[1];
    if (scope !== undefined) return scope;
  }

  throw new Error("The root package.json does not depend on @<scope>/biome.");
}

function listTrackedFiles(): string[] {
  const result = Bun.spawnSync(["git", "ls-files", "-z"]);
  if (result.exitCode !== 0) throw new Error("git ls-files failed.");

  return result.stdout
    .toString()
    .split("\0")
    .filter(
      (path) =>
        path !== "" && path !== "scripts/rename-workspace-scope.script.ts",
    )
    .filter((path) => {
      const stats = lstatSync(path, { throwIfNoEntry: false });
      return stats !== undefined && stats.isFile();
    });
}

async function replaceInTrackedFiles(
  replace: (path: string, content: string) => string,
): Promise<number> {
  let changedFiles = 0;

  for (const path of listTrackedFiles()) {
    const bytes = await Bun.file(path).bytes();
    if (bytes.includes(0)) continue;

    const content = new TextDecoder().decode(bytes);
    const replaced = replace(path, content);
    if (replaced === content) continue;

    await Bun.write(path, replaced);
    changedFiles += 1;
  }

  return changedFiles;
}

async function renameScope(): Promise<void> {
  if (!npmScopePattern.test(NEW_SCOPE)) {
    throw new Error(`"${NEW_SCOPE}" is not a valid npm scope.`);
  }

  const currentScope = readCurrentScope(await Bun.file("package.json").json());
  if (currentScope === NEW_SCOPE) {
    console.info(`The workspace scope is already @${NEW_SCOPE}.`);
    return;
  }

  const from = `@${currentScope}/`;
  const to = `@${NEW_SCOPE}/`;
  const escapedFrom = `@${currentScope}\\/`;
  const escapedTo = `@${NEW_SCOPE}\\/`;
  const changedFiles = await replaceInTrackedFiles((_path, content) =>
    content.replaceAll(from, to).replaceAll(escapedFrom, escapedTo),
  );
  console.info(`Renamed ${from} to ${to} in ${changedFiles} files.`);
}

async function renameContainerPrefix(): Promise<void> {
  if (!containerPrefixPattern.test(NEW_CONTAINER_PREFIX)) {
    throw new Error(`"${NEW_CONTAINER_PREFIX}" is not a valid name prefix.`);
  }

  const prefixSource = await Bun.file(prefixFile).text();
  const currentPrefix = prefixAssignmentPattern.exec(prefixSource)?.[1];
  if (currentPrefix === undefined) {
    throw new Error(`${prefixFile} has no PROJECT_PREFIX assignment.`);
  }
  if (currentPrefix === NEW_CONTAINER_PREFIX) {
    console.info(`The container prefix is already ${NEW_CONTAINER_PREFIX}.`);
    return;
  }

  const containerNamePattern = new RegExp(
    `(?<![\\w./-])${currentPrefix}-(?=(?:${containerNameSuffixes.join("|")})\\b)`,
    "g",
  );
  const changedFiles = await replaceInTrackedFiles((path, content) => {
    if (path === prefixFile) {
      return content.replace(
        prefixAssignmentPattern,
        `PROJECT_PREFIX=${NEW_CONTAINER_PREFIX}`,
      );
    }
    return content.replace(containerNamePattern, `${NEW_CONTAINER_PREFIX}-`);
  });
  console.info(
    `Renamed the container prefix ${currentPrefix} to ${NEW_CONTAINER_PREFIX} in ${changedFiles} files.`,
  );
}

await renameScope();
await renameContainerPrefix();

for (const command of [
  ["bun", "install"],
  ["bun", "run", "format"],
]) {
  const result = Bun.spawnSync(command, {
    stdout: "inherit",
    stderr: "inherit",
  });
  if (result.exitCode !== 0) process.exit(result.exitCode);
}
