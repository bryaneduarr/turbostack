import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { toTestDatabaseName } from "@workspace/database/config/test-database/test-database-name.service";

const serverEnvPath = fileURLToPath(
  new URL("../../../../../server/.env", import.meta.url),
);

// Copies only DB_* so other server secrets never enter test processes,
// then points every test process and started server at the test database.
export function loadDatabaseEnvironment(): void {
  if (!existsSync(serverEnvPath)) return;
  const serverEnv = parseEnv(readFileSync(serverEnvPath, "utf8"));
  for (const [name, value] of Object.entries(serverEnv)) {
    if (name.startsWith("DB_") && process.env[name] === undefined) {
      process.env[name] = value;
    }
  }
  const databaseName = process.env.DB_NAME;
  if (databaseName !== undefined) {
    process.env.DB_NAME = toTestDatabaseName(databaseName);
  }
}
