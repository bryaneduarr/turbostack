import { lstatSync } from "node:fs";

const NEW_SCOPE = "workspace";

const npmScopePattern = /^[a-z0-9][a-z0-9._-]*$/;
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
    .filter(
      (path) => lstatSync(path, { throwIfNoEntry: false })?.isFile() === true,
    );
}

if (!npmScopePattern.test(NEW_SCOPE)) {
  throw new Error(`"${NEW_SCOPE}" is not a valid npm scope.`);
}

const currentScope = readCurrentScope(await Bun.file("package.json").json());

if (currentScope === NEW_SCOPE) {
  console.info(`The workspace scope is already @${NEW_SCOPE}.`);
  process.exit(0);
}

const from = `@${currentScope}/`;
const to = `@${NEW_SCOPE}/`;
let changedFiles = 0;

for (const path of listTrackedFiles()) {
  const bytes = await Bun.file(path).bytes();
  if (bytes.includes(0)) continue;

  const content = new TextDecoder().decode(bytes);
  if (!content.includes(from)) continue;

  await Bun.write(path, content.replaceAll(from, to));
  changedFiles += 1;
}

console.info(`Renamed ${from} to ${to} in ${changedFiles} files.`);

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
