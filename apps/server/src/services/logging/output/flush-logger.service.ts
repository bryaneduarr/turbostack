import logger from "@/services/logging/output/logger.config";

export async function flushLogger(): Promise<void> {
  // A failed or unavailable log transport must not prevent shutdown indefinitely.
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, 2000);
    const finish = () => {
      clearTimeout(timeout);
      resolve();
    };
    try {
      logger.flush(finish);
    } catch {
      finish();
    }
  });
}
