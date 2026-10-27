import type { DatabaseRoleLogin } from "@workspace/database/types/credentials/database-role-login.interface";
import type { ValidatedDatabaseTarget } from "@workspace/schemas/database/environment/target/database-target-env.interface";
import type postgres from "postgres";

export function createDatabaseCredentials(
  target: ValidatedDatabaseTarget,
  { user, password }: DatabaseRoleLogin,
) {
  return {
    host: target.DB_HOST,
    port: target.DB_PORT,
    user,
    password,
    database: target.DB_NAME,
    ssl: target.DB_SSL_MODE === "verify-full" ? "verify-full" : false,
  } satisfies postgres.Options<Record<string, never>>;
}
