import { setTimeout as delay } from "node:timers/promises";
import app from "@/application.module";
import env from "@/config/environment/server-env.config";
import { client } from "@/db/config/connection/database-connection.config";
import logger from "@/services/logging/output/logger.config";

export async function shutdownServer(): Promise<void> {
  const server = app.server;

  try {
    if (server) {
      // Capture stop failures immediately while active handlers finish using the pool.
      const stopped = Promise.allSettled([app.stop(false)]);
      const deadline = Date.now() + env.SHUTDOWN_TIMEOUT_SECONDS * 1000;

      while (server.pendingRequests > 0 && Date.now() < deadline) {
        await delay(50);
      }

      if (server.pendingRequests > 0) {
        logger.warn(
          { event: "server.shutdown_deadline" },
          "Shutdown deadline reached; closing active requests",
        );
        await server.stop(true);
      }

      const [result] = await stopped;
      if (result.status === "rejected") {
        const error: unknown = result.reason;
        throw error;
      }
    }
  } finally {
    await client.end({ timeout: env.DB_SHUTDOWN_TIMEOUT_SECONDS });
  }
}
