import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { writeEnvironmentAssignment } from "@workspace/setup/environment/write-environment-assignment.service";
import type { AppName } from "@workspace/setup/types/environment/app-name.interface";

const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const appNames: readonly AppName[] = ["server", "client"];

export async function setupEnvironment(): Promise<void> {
  for (const app of appNames) {
    await createEnvironmentFile(app);
  }

  const clientEnvironment = parseEnv(
    await readFile(environmentPath("client"), "utf8"),
  );
  if (clientEnvironment.NODE_ENV === undefined) {
    await setAssignment("client", "NODE_ENV", "development");
  }
}

function environmentPath(app: AppName): string {
  return join(repositoryRoot, "apps", app, ".env");
}

async function createEnvironmentFile(app: AppName): Promise<void> {
  if (existsSync(environmentPath(app))) {
    console.log(`Kept apps/${app}/.env.`);
    return;
  }

  const examplePath = `${environmentPath(app)}.example`;
  if (!existsSync(examplePath)) {
    throw new Error(
      `Missing apps/${app}/.env.example; restore it from git, then run bun run setup:env again.`,
    );
  }

  await writeFile(environmentPath(app), await readFile(examplePath), {
    mode: 0o600,
  });
  console.log(`Created apps/${app}/.env.`);
}

async function setAssignment(
  app: AppName,
  name: string,
  value: string,
): Promise<void> {
  if (await writeEnvironmentAssignment(environmentPath(app), name, value)) {
    console.log(`Wrote ${name} to apps/${app}/.env.`);
  }
}
