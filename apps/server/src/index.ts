import app from "@/application.module";
import { connectToDatabase } from "@/config/database/database-connection.config";
import env from "@/config/environment/server-env.config";
import { flushLogger } from "@/services/logging/output/flush-logger.service";
import logger from "@/services/logging/output/logger.config";
import { shutdownServer } from "@/services/server/shutdown/shutdown-server.service";

let stopping = false;

async function stopServer(): Promise<void> {
  if (stopping) return;
  stopping = true;

  try {
    await shutdownServer();
    logger.info({ event: "server.stopped" }, "Shutdown complete");
    await flushLogger();
    process.exit(0);
  } catch (error) {
    logger.error(
      { event: "server.stop_failed", err: error },
      "Shutdown failed",
    );
    await flushLogger();
    process.exit(1);
  }
}

process.once("SIGTERM", () => {
  void stopServer();
});
process.once("SIGINT", () => {
  void stopServer();
});

async function startServer(): Promise<void> {
  try {
    await connectToDatabase();
    if (stopping) return;

    app.listen({
      port: env.PORT,
      maxRequestBodySize: env.MAX_REQUEST_BODY_BYTES,
      idleTimeout: env.HTTP_IDLE_TIMEOUT_SECONDS,
    });
    logger.info(
      { event: "server.started", port: env.PORT },
      "Server listening",
    );
  } catch (error) {
    if (stopping) return;
    stopping = true;
    logger.fatal(
      { event: "server.start_failed", err: error },
      "Failed to start server",
    );
    try {
      await shutdownServer();
    } catch (shutdownError) {
      logger.error(
        { event: "server.cleanup_failed", err: shutdownError },
        "Startup cleanup failed",
      );
    }
    await flushLogger();
    process.exit(1);
  }
}

void startServer();
