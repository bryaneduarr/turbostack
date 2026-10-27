import type { BranchCommit } from "@workspace/rules/types/commits/branch-commit.interface";

const baseRef = "origin/main";
const recordSeparator = "\u001e";
const fieldSeparator = "\u0000";

async function runGit(rootPath: string, args: string[]) {
  const git = Bun.spawn(["git", ...args], {
    cwd: rootPath,
    stdout: "pipe",
    stderr: "ignore",
  });
  const output = await new Response(git.stdout).text();
  return { exitCode: await git.exited, output };
}

// Without a fetched main there is no branch range to compare.
export async function listBranchCommits(
  rootPath: string,
): Promise<BranchCommit[]> {
  const base = await runGit(rootPath, ["merge-base", "HEAD", baseRef]);
  if (base.exitCode !== 0) return [];

  const log = await runGit(rootPath, [
    "log",
    "--no-merges",
    "--format=%h%x00%B%x1e",
    `${base.output.trim()}..HEAD`,
  ]);
  if (log.exitCode !== 0) {
    throw new Error(
      "git log failed; run the rule checks inside the repository.",
    );
  }

  return log.output
    .split(recordSeparator)
    .map((record) => record.replace(/^\n/, ""))
    .filter((record) => record !== "")
    .map((record) => {
      const [hash = "", message = ""] = record.split(fieldSeparator);
      return { hash, message };
    });
}
