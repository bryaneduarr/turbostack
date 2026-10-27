import { createDatabaseCredentials } from "@workspace/database/config/credentials/create-database-credentials.service";
import type { ValidatedDatabaseProvisionEnvironment } from "@workspace/schemas/database/environment/provision/database-provision-env.interface";
import postgres from "postgres";

export function openAdminDatabaseConnection(
  provisionEnv: ValidatedDatabaseProvisionEnvironment,
  database: string,
): postgres.Sql {
  return postgres({
    ...createDatabaseCredentials(provisionEnv, {
      user: provisionEnv.DB_ADMIN_USER,
      password: provisionEnv.DB_ADMIN_PASSWORD,
    }),
    database,
    max: 1,
    onnotice: () => {},
  });
}
