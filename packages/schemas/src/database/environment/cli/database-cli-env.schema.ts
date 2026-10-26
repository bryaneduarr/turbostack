import { databaseTargetEnvSchema } from "@workspace/schemas/database/environment/target/database-target-env.schema";
import { DATABASE_ROLES } from "@workspace/schemas/database/roles/database-role.constant";
import { z } from "zod";

export const databaseCliEnvSchema = databaseTargetEnvSchema.extend({
  /** Identifies the read-only operator role used for manual inspection. */
  DB_CLI_USER: z.literal(DATABASE_ROLES.cli),
  /** Contains the read-only operator role's password without trimming or transformation. */
  DB_CLI_PASSWORD: z.string().min(1),
});
