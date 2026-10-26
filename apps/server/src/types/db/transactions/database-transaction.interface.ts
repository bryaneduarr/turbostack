import type { db } from "@/config/database/database-connection.config";

/** Represents an open transaction on the API's database connection. */
export type DatabaseTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

/** Runs queries either directly on the pool or inside a caller's transaction. */
export type DatabaseExecutor = typeof db | DatabaseTransaction;
