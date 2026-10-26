import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

export function environmentFilePath(app: "server" | "client"): string {
  return fileURLToPath(
    new URL(`../../../../../apps/${app}/.env`, import.meta.url),
  );
}

export async function readEnvironmentFile(
  path: string,
): Promise<Record<string, string>> {
  const values = parseEnv(await readFile(path, "utf8"));
  return Object.fromEntries(
    Object.entries(values).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
}
