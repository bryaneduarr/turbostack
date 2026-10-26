import type { fixtureDb } from "@/db/testing/fixtures/connection/fixture-database-connection.config";

/** Represents an open transaction on the test fixture database connection. */
export type FixtureTransaction = Parameters<
  Parameters<typeof fixtureDb.transaction>[0]
>[0];
