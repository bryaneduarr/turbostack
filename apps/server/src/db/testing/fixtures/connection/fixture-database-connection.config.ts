import { databaseMigratorCredentials } from "@workspace/database/config/environment/database-migrator-credentials.config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Tests arrange and clean up rows as the schema owner, because the API role
// deliberately lacks privileges such as deleting accounts.
const fixtureClient = postgres({ ...databaseMigratorCredentials, max: 2 });

export const fixtureDb = drizzle({ client: fixtureClient });
