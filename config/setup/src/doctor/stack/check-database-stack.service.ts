import { readdir } from "node:fs/promises";
import path from "node:path";
import { databaseEnvSchema } from "@workspace/schemas/database/environment/database-env.schema";
import { databaseMigratorEnvSchema } from "@workspace/schemas/database/environment/migrator/database-migrator-env.schema";
import type { ValidatedDatabaseTarget } from "@workspace/schemas/database/environment/target/database-target-env.interface";
import { isDevcontainer } from "@workspace/setup/doctor/preflight/is-devcontainer.service";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";
import type { DatabaseLogin } from "@workspace/setup/types/doctor/stack/database-login.interface";
import { SQL } from "bun";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");
const migrationsDirectory = path.join(
  repositoryRoot,
  "packages/database/src/migrations",
);
function createSqlOptions(
  target: ValidatedDatabaseTarget,
  login: DatabaseLogin,
) {
  return {
    hostname: target.DB_HOST,
    port: target.DB_PORT,
    database: target.DB_NAME,
    username: login.user,
    password: login.password,
    tls: target.DB_SSL_MODE === "verify-full",
    max: 1,
  };
}

async function withDatabase<T>(
  target: ValidatedDatabaseTarget,
  login: DatabaseLogin,
  run: (sql: SQL) => Promise<T>,
): Promise<T> {
  const client = new SQL(createSqlOptions(target, login));
  try {
    return await run(client);
  } finally {
    await client.close();
  }
}

async function canConnect(
  target: ValidatedDatabaseTarget,
  login: DatabaseLogin,
): Promise<boolean> {
  return withDatabase(target, login, async (sql) => {
    await sql`SELECT 1`;
  }).then(
    () => true,
    () => false,
  );
}

async function countAppliedMigrations(sql: SQL): Promise<number> {
  const tableRows = await sql<readonly { present: boolean }[]>`
    SELECT to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS present
  `;
  if (tableRows[0]?.present !== true) return 0;
  const [migrationCount] = await sql<readonly { applied: number }[]>`
    SELECT count(*)::int AS applied FROM drizzle.__drizzle_migrations
  `;
  if (migrationCount === undefined) {
    throw new Error("The migration count query returned no number.");
  }
  return migrationCount.applied;
}

async function countMigrationFiles(): Promise<number> {
  const entries = await readdir(migrationsDirectory);
  return entries.filter((entry) => entry.endsWith(".sql")).length;
}

async function checkMigrations(
  target: ValidatedDatabaseTarget,
  login: DatabaseLogin,
): Promise<readonly DoctorFailure[]> {
  let applied: number;
  try {
    applied = await withDatabase(target, login, countAppliedMigrations);
  } catch {
    return [
      {
        summary: `Migration role ${login.user} cannot read ${target.DB_NAME}`,
        reason: "The migration count cannot be checked without this role.",
        fix: "bun run db:provision",
      },
    ];
  }
  const migrationFiles = await countMigrationFiles();
  if (applied === migrationFiles) return [];
  return [
    {
      summary: `${applied} of ${migrationFiles} migrations are applied`,
      reason: "The API needs every migration file applied to the database.",
      fix: "bun run drizzle:migrate",
    },
  ];
}

export async function checkDatabaseStack(
  environment: Readonly<Record<string, string>>,
): Promise<readonly DoctorFailure[]> {
  const api = databaseEnvSchema.safeParse(environment);
  const migrator = databaseMigratorEnvSchema.safeParse(environment);
  if (!api.success || !migrator.success) {
    return [
      {
        summary: "Server database settings are invalid",
        reason: "The server env file does not match the database schemas.",
        fix: "bun run setup:env",
      },
    ];
  }

  const target = api.data;
  const apiLogin = {
    user: api.data.DB_USER,
    password: api.data.DB_PASSWORD,
  };
  const migratorLogin = {
    user: migrator.data.DB_MIGRATOR_USER,
    password: migrator.data.DB_MIGRATOR_PASSWORD,
  };

  if (!(await canConnect(target, apiLogin))) {
    return [
      {
        summary: `PostgreSQL database ${target.DB_NAME} at ${target.DB_HOST}:${target.DB_PORT} does not answer`,
        reason: "The API and migrations cannot run without this database.",
        fix: isDevcontainer()
          ? "from the host, run docker compose -f .devcontainer/docker-compose.yml up -d postgres"
          : "bun run db:up",
      },
    ];
  }

  return checkMigrations(target, migratorLogin);
}
