import { databaseTargetEnvSchema } from "@workspace/schemas/database/environment/target/database-target-env.schema";
import { z } from "zod";

export const databaseProvisionEnvSchema = databaseTargetEnvSchema.extend({
  /** Identifies the administrative role that creates the other roles and transfers ownership. */
  DB_ADMIN_USER: z.string().trim().min(1),
  /** Contains the administrative role's password without trimming or transformation. */
  DB_ADMIN_PASSWORD: z.string().min(1),
  /** Sets the password of the schema-owning migrator role. */
  DB_MIGRATOR_PASSWORD: z.string().min(1),
  /** Sets the password of the API's role. */
  DB_PASSWORD: z.string().min(1),
  /** Sets the password of the read-only operator role. */
  DB_CLI_PASSWORD: z.string().min(1),
});
