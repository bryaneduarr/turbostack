import type { Logger } from "pino";
import { client } from "@/db/config/connection/database-connection.config";
import { ExpectedFailure } from "@/services/responses/errors/expected-failure.error";

export async function assertDatabaseReady(logger: Logger): Promise<void> {
  try {
    await client`SELECT 1`;
  } catch (error) {
    logger.warn(
      { event: "health.database_unavailable", err: error },
      "Database readiness check failed",
    );
    throw new ExpectedFailure({
      code: "SERVICE_UNAVAILABLE",
      message: "Database is unavailable.",
    });
  }
}
