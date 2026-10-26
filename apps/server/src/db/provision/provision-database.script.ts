import type { ValidatedDatabaseProvisionEnvironment } from "@workspace/schemas/database/environment/provision/database-provision-env.interface";
import { databaseProvisionEnvSchema } from "@workspace/schemas/database/environment/provision/database-provision-env.schema";
import { DATABASE_ROLES } from "@workspace/schemas/database/roles/database-role.constant";
import { z } from "zod";
import { openAdminDatabaseConnection } from "@/config/database/admin-database-connection.config";
import { readProvisionSql } from "@/db/provision/read-provision-sql.service";

const provisionEnv: ValidatedDatabaseProvisionEnvironment =
  databaseProvisionEnvSchema.parse(process.env);
const provisionSql = await readProvisionSql();
const rolePasswords = [
  [DATABASE_ROLES.migrator, provisionEnv.DB_MIGRATOR_PASSWORD],
  [DATABASE_ROLES.runtime, provisionEnv.DB_PASSWORD],
  [DATABASE_ROLES.cli, provisionEnv.DB_CLI_PASSWORD],
] as const;
const alterRoleStatementSchema = z.tuple([z.object({ statement: z.string() })]);

const client = openAdminDatabaseConnection(provisionEnv, provisionEnv.DB_NAME);

try {
  await client.begin(async (transaction) => {
    await transaction.unsafe(provisionSql);
    for (const [role, password] of rolePasswords) {
      // format() quotes the password server-side because ALTER ROLE takes no parameters.
      const [{ statement }] = alterRoleStatementSchema.parse(
        await transaction`SELECT format('ALTER ROLE %I WITH PASSWORD %L', ${role}::text, ${password}::text) AS statement`,
      );
      await transaction.unsafe(statement);
    }
  });
  console.info("Database roles provisioned.");
} catch (error) {
  console.error("Database provisioning failed.", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
