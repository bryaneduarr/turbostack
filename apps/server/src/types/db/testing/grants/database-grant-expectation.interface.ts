import type { DATABASE_ROLES } from "@workspace/schemas/database/roles/database-role.constant";

/** Names one of the fixed database roles that provisioning creates. */
export type DatabaseRole = (typeof DATABASE_ROLES)[keyof typeof DATABASE_ROLES];

/** Names a role that application processes connect as, excluding the schema owner. */
export type RuntimeDatabaseRole = Exclude<
  DatabaseRole,
  (typeof DATABASE_ROLES)["migrator"]
>;

/** Lists the table-level privileges a grant test checks; updates are always granted per column. */
export type TablePrivilege =
  | "SELECT"
  | "INSERT"
  | "DELETE"
  | "TRUNCATE"
  | "REFERENCES"
  | "TRIGGER";

/** Describes exactly what one runtime role may do with one table. */
export interface TableGrantExpectation {
  /** Lists every table-level privilege the role holds; any other privilege must be absent. */
  privileges: readonly TablePrivilege[];
  /** Lists every column the role may update; every other column must be read-only for it. */
  updatableColumns: readonly string[];
}

/** Maps every table in the public schema to one role's expected grants. */
export type RoleGrantExpectations = Readonly<
  Record<string, TableGrantExpectation>
>;
