import { existsSync } from "node:fs";
import path from "node:path";

import { isDevcontainer } from "@workspace/setup/doctor/preflight/is-devcontainer.service";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");
const manifestPath = path.join(repositoryRoot, "package.json");
const bunPinPrefix = "bun@";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function readPinnedBunVersion(manifest: unknown): string {
  const packageManager = isRecord(manifest)
    ? manifest.packageManager
    : undefined;
  if (
    typeof packageManager !== "string" ||
    !packageManager.startsWith(bunPinPrefix)
  ) {
    throw new Error(
      "package.json packageManager must pin Bun as bun@<version>.",
    );
  }
  return packageManager.slice(bunPinPrefix.length);
}

async function commandSucceeds(command: string[]): Promise<boolean> {
  try {
    const child = Bun.spawn(command, { stdout: "ignore", stderr: "ignore" });
    return (await child.exited) === 0;
  } catch {
    return false;
  }
}

export async function checkToolchain(): Promise<readonly DoctorFailure[]> {
  const manifest: unknown = await Bun.file(manifestPath).json();
  const pinnedBunVersion = readPinnedBunVersion(manifest);
  const hostDockerRequired = !isDevcontainer();
  const [hasGit, hasDockerDaemon, hasCompose] = await Promise.all([
    commandSucceeds(["git", "--version"]),
    hostDockerRequired ? commandSucceeds(["docker", "info"]) : true,
    hostDockerRequired
      ? commandSucceeds(["docker", "compose", "version"])
      : true,
  ]);
  const failures: DoctorFailure[] = [];

  if (Bun.version !== pinnedBunVersion) {
    failures.push({
      summary: `Bun ${Bun.version} is not the pinned version`,
      reason: `package.json pins bun@${pinnedBunVersion}`,
      fix: isDevcontainer()
        ? `set the oven/bun image in .devcontainer/Dockerfile to ${pinnedBunVersion}, then rebuild the devcontainer`
        : `curl -fsSL https://bun.sh/install | bash -s "bun-v${pinnedBunVersion}"`,
    });
  }
  if (!hasGit) {
    failures.push({
      summary: "git is not installed",
      reason: "the repository is cloned and updated with git",
      fix: "see docs/requirements.md",
    });
  }
  if (hostDockerRequired && !hasDockerDaemon) {
    failures.push({
      summary: "Docker is not reachable",
      reason: "the database runs in Docker",
      fix:
        process.platform === "darwin"
          ? "open -a Docker"
          : "sudo systemctl start docker",
    });
  }
  if (hostDockerRequired && !hasCompose) {
    failures.push({
      summary: "Docker Compose v2 is not available",
      reason: "the services are started with docker compose",
      fix: "see docs/requirements.md",
    });
  }
  if (!existsSync(path.join(repositoryRoot, "node_modules/.bin/turbo"))) {
    failures.push({
      summary: "Dependencies are not installed",
      reason: "the turbo task runner is missing from node_modules",
      fix: "bun install",
    });
  }
  return failures;
}
