import type { ValidatedDatabaseEnvironment } from "@workspace/schemas/database/environment/database-env.interface";
import { databaseEnvSchema } from "@workspace/schemas/database/environment/database-env.schema";
import type postgres from "postgres";

const databaseEnv: ValidatedDatabaseEnvironment = databaseEnvSchema.parse(
  process.env,
);

export const databaseCredentials = {
  host: databaseEnv.DB_HOST,
  port: databaseEnv.DB_PORT,
  user: databaseEnv.DB_USER,
  password: databaseEnv.DB_PASSWORD,
  database: databaseEnv.DB_NAME,
  ssl: databaseEnv.DB_SSL_MODE === "verify-full" ? "verify-full" : false,
} satisfies postgres.Options<Record<string, never>>;
