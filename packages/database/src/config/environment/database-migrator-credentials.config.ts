import { createDatabaseCredentials } from "@workspace/database/config/credentials/create-database-credentials.service";
import type { ValidatedDatabaseMigratorEnvironment } from "@workspace/schemas/database/environment/migrator/database-migrator-env.interface";
import { databaseMigratorEnvSchema } from "@workspace/schemas/database/environment/migrator/database-migrator-env.schema";

const migratorEnv: ValidatedDatabaseMigratorEnvironment =
  databaseMigratorEnvSchema.parse(process.env);

export const databaseMigratorCredentials = createDatabaseCredentials(
  migratorEnv,
  {
    user: migratorEnv.DB_MIGRATOR_USER,
    password: migratorEnv.DB_MIGRATOR_PASSWORD,
  },
);
