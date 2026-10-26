import type { databaseProvisionEnvSchema } from "@workspace/schemas/database/environment/provision/database-provision-env.schema";
import type { z } from "zod";

type ValidatedDatabaseProvisionData = z.output<
  typeof databaseProvisionEnvSchema
>;

/** Contains the administrative connection and every role password that provisioning applies. */
export interface ValidatedDatabaseProvisionEnvironment
  extends ValidatedDatabaseProvisionData {
  /** Identifies the administrative role that provisioning connects as. */
  DB_ADMIN_USER: ValidatedDatabaseProvisionData["DB_ADMIN_USER"];
  /** Contains the administrative role's password. */
  DB_ADMIN_PASSWORD: ValidatedDatabaseProvisionData["DB_ADMIN_PASSWORD"];
  /** Contains the migrator role's password. */
  DB_MIGRATOR_PASSWORD: ValidatedDatabaseProvisionData["DB_MIGRATOR_PASSWORD"];
  /** Contains the API role's password. */
  DB_PASSWORD: ValidatedDatabaseProvisionData["DB_PASSWORD"];
  /** Contains the read-only operator role's password. */
  DB_CLI_PASSWORD: ValidatedDatabaseProvisionData["DB_CLI_PASSWORD"];
}
