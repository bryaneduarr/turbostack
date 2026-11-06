const dependencySections = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

const folderOrder = ["apps", "config", "packages"];

function git(args: string[]): string {
  const result = Bun.spawnSync(["git", ...args], { stderr: "inherit" });
  if (result.exitCode !== 0) {
    throw new Error(`git ${args.join(" ")} failed.`);
  }
  return result.stdout.toString();
}

function readDependencyRanges(manifestText: string): Map<string, string> {
  const ranges = new Map<string, string>();
  const manifest: unknown = JSON.parse(manifestText);
  if (typeof manifest !== "object" || manifest === null) return ranges;

  for (const [section, entries] of Object.entries(manifest)) {
    if (!dependencySections.includes(section)) continue;
    if (typeof entries !== "object" || entries === null) continue;
    for (const [name, range] of Object.entries(entries)) {
      if (typeof range === "string") ranges.set(name, range);
    }
  }
  return ranges;
}

function manifestTitle(path: string): string {
  const folders = path.split("/").slice(0, -1);
  const parent = folders.at(-1);
  if (parent === undefined) return "package.json";
  if (folders[0] === "config") return `config/${parent}/package.json`;
  return `${parent}/package.json`;
}

function manifestRank(path: string): number {
  const rank = folderOrder.indexOf(path.split("/")[0] ?? "");
  return path === "package.json" || rank === -1 ? folderOrder.length : rank;
}

async function describeUpdates(path: string): Promise<string[]> {
  const before = readDependencyRanges(git(["show", `HEAD:${path}`]));
  const after = readDependencyRanges(await Bun.file(path).text());
  const lines: string[] = [];

  for (const [name, range] of after) {
    const previous = before.get(name);
    if (previous === undefined) {
      console.warn(`${path}: ${name} was added, not updated.`);
    } else if (previous !== range) {
      lines.push(`- updated ${name} from \`${previous}\` to \`${range}\`.`);
    }
  }
  for (const name of before.keys()) {
    if (!after.has(name)) console.warn(`${path}: ${name} was removed.`);
  }
  return lines;
}

const changedManifests = git([
  "diff",
  "--name-only",
  "HEAD",
  "--",
  ":(glob)**/package.json",
])
  .split("\n")
  .filter((path) => path !== "")
  .sort((a, b) => manifestRank(a) - manifestRank(b) || a.localeCompare(b));

const sections: string[] = [];
for (const path of changedManifests) {
  const lines = await describeUpdates(path);
  if (lines.length > 0) {
    sections.push(`**${manifestTitle(path)}**\n\n${lines.join("\n")}`);
  }
}

if (sections.length === 0) {
  throw new Error("No dependency versions changed in any package.json.");
}

console.info(
  `updated dependencies to latest version\n\n${sections.join("\n\n")}`,
);
