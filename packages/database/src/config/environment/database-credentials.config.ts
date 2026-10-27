import { createDatabaseCredentials } from "@workspace/database/config/credentials/create-database-credentials.service";
import type { ValidatedDatabaseEnvironment } from "@workspace/schemas/database/environment/database-env.interface";
import { databaseEnvSchema } from "@workspace/schemas/database/environment/database-env.schema";

const databaseEnv: ValidatedDatabaseEnvironment = databaseEnvSchema.parse(
  process.env,
);

export const databaseCredentials = createDatabaseCredentials(databaseEnv, {
  user: databaseEnv.DB_USER,
  password: databaseEnv.DB_PASSWORD,
});
