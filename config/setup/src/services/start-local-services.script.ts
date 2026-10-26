import path from "node:path";
import { isDevcontainer } from "@workspace/setup/doctor/preflight/is-devcontainer.service";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const startCommands = [
  [
    "docker",
    "compose",
    "--env-file",
    "apps/server/.env",
    "up",
    "--detach",
    "--wait",
    "postgres",
  ],
];

async function runInherited(command: readonly string[]): Promise<number> {
  const child = Bun.spawn([...command], {
    cwd: repositoryRoot,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  return child.exited;
}

async function main(): Promise<number> {
  if (isDevcontainer()) {
    console.info("The devcontainer already runs these services.");
    return 0;
  }
  for (const command of startCommands) {
    const exitCode = await runInherited(command);
    if (exitCode !== 0) return exitCode;
  }
  return 0;
}

process.exit(await main());
