// Includes untracked files that are not ignored, so new files fail before
// they are committed.
export async function listTrackedFiles(rootPath: string): Promise<string[]> {
  const listing = Bun.spawn(
    ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: rootPath, stdout: "pipe", stderr: "inherit" },
  );
  const output = await new Response(listing.stdout).text();
  if ((await listing.exited) !== 0) {
    throw new Error(
      "git ls-files failed; run the rule checks inside the repository.",
    );
  }

  const paths = new Set(output.split("\0").filter((path) => path !== ""));
  const existing = await Promise.all(
    [...paths].map(async (path) =>
      (await Bun.file(`${rootPath}/${path}`).exists()) ? path : null,
    ),
  );
  return existing.filter((path) => path !== null).sort();
}
