import type { databaseCliEnvSchema } from "@workspace/schemas/database/environment/cli/database-cli-env.schema";
import type { z } from "zod";

type ValidatedDatabaseCliData = z.output<typeof databaseCliEnvSchema>;

/** Contains the validated settings the read-only operator role connects with. */
export interface ValidatedDatabaseCliEnvironment
  extends ValidatedDatabaseCliData {
  /** Identifies the command-line tool's database role. */
  DB_CLI_USER: ValidatedDatabaseCliData["DB_CLI_USER"];
  /** Contains the command-line tool role's password. */
  DB_CLI_PASSWORD: ValidatedDatabaseCliData["DB_CLI_PASSWORD"];
}
