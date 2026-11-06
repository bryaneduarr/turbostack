import { Glob } from "bun";

const versionPattern = /^\d+\.\d+\.\d+$/;

async function fetchLatestVersion(packageName: string): Promise<string> {
  const response = await fetch(
    `https://registry.npmjs.org/${packageName}/latest`,
  );
  if (!response.ok) {
    throw new Error(`Could not read the latest ${packageName} version.`);
  }

  const manifest: unknown = await response.json();
  if (
    typeof manifest !== "object" ||
    manifest === null ||
    !("version" in manifest) ||
    typeof manifest.version !== "string" ||
    !versionPattern.test(manifest.version)
  ) {
    throw new Error(
      `The npm registry returned no stable ${packageName} version.`,
    );
  }
  return manifest.version;
}

async function replaceInFile(
  path: string,
  replacements: [pattern: RegExp, replacement: string][],
): Promise<void> {
  const original = await Bun.file(path).text();
  let content = original;
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(content)) {
      throw new Error(`${path} has no ${pattern.source} entry to update.`);
    }
    content = content.replace(pattern, replacement);
  }
  if (content !== original) await Bun.write(path, content);
}

const [bunVersion, turboVersion] = await Promise.all([
  fetchLatestVersion("bun"),
  fetchLatestVersion("turbo"),
]);

await replaceInFile("package.json", [
  [/"packageManager": "bun@[^"]+"/, `"packageManager": "bun@${bunVersion}"`],
  [/"turbo": "[^"]+"/, `"turbo": "^${turboVersion}"`],
]);

for await (const dockerfile of new Glob("apps/*/Dockerfile").scan()) {
  await replaceInFile(dockerfile, [
    [/ARG BUN_VERSION=\S+/, `ARG BUN_VERSION=${bunVersion}`],
    [/ARG TURBO_VERSION=\S+/, `ARG TURBO_VERSION=${turboVersion}`],
  ]);
}

const install = Bun.spawnSync(["bun", "install"], {
  stdout: "inherit",
  stderr: "inherit",
});
if (install.exitCode !== 0) process.exit(install.exitCode);

console.info(`Pinned Bun ${bunVersion} and Turbo ${turboVersion}.`);
if (Bun.version !== bunVersion) {
  console.info(`Run "bun upgrade" to use Bun ${bunVersion} locally.`);
}
