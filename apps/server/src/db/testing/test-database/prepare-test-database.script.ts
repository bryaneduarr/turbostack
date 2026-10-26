import { toTestDatabaseName } from "@workspace/database/config/test-database/test-database-name.service";
import type { ValidatedDatabaseProvisionEnvironment } from "@workspace/schemas/database/environment/provision/database-provision-env.interface";
import { databaseProvisionEnvSchema } from "@workspace/schemas/database/environment/provision/database-provision-env.schema";
import type postgres from "postgres";
import { openAdminDatabaseConnection } from "@/config/database/admin-database-connection.config";
import { readProvisionSql } from "@/db/provision/read-provision-sql.service";

const provisionEnv: ValidatedDatabaseProvisionEnvironment =
  databaseProvisionEnvSchema.parse(process.env);
const testDatabaseName = toTestDatabaseName(provisionEnv.DB_NAME);
const provisionSql = await readProvisionSql();

async function withAdminConnection(
  database: string,
  run: (client: postgres.Sql) => Promise<unknown>,
): Promise<void> {
  const client = openAdminDatabaseConnection(provisionEnv, database);
  try {
    await run(client);
  } finally {
    await client.end();
  }
}

async function applyMigrations(): Promise<boolean> {
  const migrate = Bun.spawn(
    ["bun", "run", "--cwd", "../../packages/database", "drizzle:migrate"],
    {
      env: { ...process.env, DB_NAME: testDatabaseName },
      stdout: "inherit",
      stderr: "inherit",
    },
  );
  return (await migrate.exited) === 0;
}

try {
  // DROP and CREATE DATABASE cannot run inside the database they replace.
  await withAdminConnection("postgres", async (client) => {
    await client`DROP DATABASE IF EXISTS ${client(testDatabaseName)} WITH (FORCE)`;
    await client`CREATE DATABASE ${client(testDatabaseName)}`;
  });
  await withAdminConnection(testDatabaseName, (client) =>
    client.unsafe(provisionSql),
  );
  if (!(await applyMigrations())) {
    throw new Error("Migrations failed on the test database.");
  }
  console.info(`Test database ${testDatabaseName} recreated.`);
} catch (error) {
  console.error("Preparing the test database failed.", error);
  process.exitCode = 1;
}
