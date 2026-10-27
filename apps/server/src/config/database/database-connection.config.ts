import { databaseCredentials } from "@workspace/database/config/environment/database-credentials.config";
import type { ValidatedDatabaseEnvironment } from "@workspace/schemas/database/environment/database-env.interface";
import { databaseEnvSchema } from "@workspace/schemas/database/environment/database-env.schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import logger from "@/services/logging/output/logger.config";

const databaseEnv: ValidatedDatabaseEnvironment = databaseEnvSchema.parse(
  process.env,
);

const client = postgres({
  ...databaseCredentials,
  max: databaseEnv.DB_POOL_MAX,
  connect_timeout: databaseEnv.DB_CONNECT_TIMEOUT_SECONDS,
  idle_timeout: databaseEnv.DB_IDLE_TIMEOUT_SECONDS,
  prepare: databaseEnv.DB_PREPARE,
  connection: {
    statement_timeout: databaseEnv.DB_STATEMENT_TIMEOUT_SECONDS * 1000,
  },
});

export async function connectToDatabase(): Promise<void> {
  try {
    await client`SELECT 1`;
    logger.info({ event: "database.connected" }, "Database connected");
  } catch (error) {
    logger.error(
      { event: "database.connection_failed", err: error },
      "Database connection failed",
    );
    throw new Error("[database]: Failed to connect to the database.", {
      cause: error,
    });
  }
}

export const db = drizzle({ client });
export { client };
