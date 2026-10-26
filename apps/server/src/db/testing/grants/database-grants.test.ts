import { afterAll, describe, expect, it } from "bun:test";
import { createDatabaseCredentials } from "@workspace/database/config/credentials/create-database-credentials.service";
import { databaseProvisionEnvSchema } from "@workspace/schemas/database/environment/provision/database-provision-env.schema";
import { DATABASE_ROLES } from "@workspace/schemas/database/roles/database-role.constant";
import postgres from "postgres";
import { z } from "zod";
import { databaseGrantExpectations } from "@/db/testing/grants/expectations/database-grant-expectations.config";
import type {
  DatabaseRole,
  TablePrivilege,
} from "@/types/db/testing/grants/database-grant-expectation.interface";

const provisionEnv = databaseProvisionEnvSchema.parse(process.env);
const tablePrivileges = [
  "SELECT",
  "INSERT",
  "DELETE",
  "TRUNCATE",
  "REFERENCES",
  "TRIGGER",
] as const satisfies readonly TablePrivilege[];
const permissionDeniedCode = "42501";

const runtimeRoles = [DATABASE_ROLES.runtime, DATABASE_ROLES.cli] as const;
const passwords: Record<DatabaseRole, string> = {
  [DATABASE_ROLES.migrator]: provisionEnv.DB_MIGRATOR_PASSWORD,
  [DATABASE_ROLES.runtime]: provisionEnv.DB_PASSWORD,
  [DATABASE_ROLES.cli]: provisionEnv.DB_CLI_PASSWORD,
};
const clients = new Map<DatabaseRole, postgres.Sql>();

function connectAs(role: DatabaseRole) {
  const existing = clients.get(role);
  if (existing !== undefined) return existing;
  const client = postgres({
    ...createDatabaseCredentials(provisionEnv, {
      user: role,
      password: passwords[role],
    }),
    max: 1,
  });
  clients.set(role, client);
  return client;
}

// Postgres.js queries run only once awaited through then(), which expect().rejects skips.
async function expectPermissionDenied(query: Promise<unknown>) {
  const outcome = await query.then(
    () => "succeeded",
    (error: unknown) => error,
  );
  expect(outcome).toMatchObject({ code: permissionDeniedCode });
}

const tableNamesSchema = z.array(z.object({ name: z.string() }));
const privilegeRowsSchema = z.array(
  z.object({ privilege: z.string(), granted: z.boolean() }),
);
const columnRowsSchema = z.array(
  z.object({ column: z.string(), updatable: z.boolean() }),
);

async function readPublicTables(client: postgres.Sql) {
  const rows = tableNamesSchema.parse(
    await client`SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`,
  );
  return rows.map(({ name }) => name);
}

afterAll(async () => {
  await Promise.all([...clients.values()].map((client) => client.end()));
});

describe("database grants", () => {
  for (const role of runtimeRoles) {
    it(`gives ${role} exactly its expected table and column privileges`, async () => {
      const expectations = databaseGrantExpectations[role];
      const client = connectAs(role);
      const tables = await readPublicTables(client);

      expect(Object.keys(expectations).sort()).toEqual(tables);
      for (const table of tables) {
        const expectation = expectations[table];
        if (expectation === undefined) {
          throw new Error(`Add ${role} grant expectations for ${table}.`);
        }
        const granted = privilegeRowsSchema.parse(
          await client`SELECT privilege, has_table_privilege(current_user, ${`public.${table}`}, privilege) AS granted FROM unnest(${tablePrivileges}::text[]) AS privilege`,
        );
        const columns = columnRowsSchema.parse(
          await client`SELECT attname AS column, has_column_privilege(current_user, attrelid, attname, 'UPDATE') AS updatable FROM pg_attribute WHERE attrelid = ${`public.${table}`}::regclass AND attnum > 0 AND NOT attisdropped ORDER BY attname`,
        );

        expect({
          table,
          privileges: granted
            .filter((row) => row.granted)
            .map((row) => row.privilege),
          updatableColumns: columns
            .filter((row) => row.updatable)
            .map((row) => row.column),
        }).toEqual({
          table,
          privileges: [...expectation.privileges],
          updatableColumns: [...expectation.updatableColumns].sort(),
        });
      }
    });
  }

  it("makes the migrator the owner of the schema and every table", async () => {
    const client = connectAs(DATABASE_ROLES.migrator);
    const owners = z
      .array(z.object({ owner: z.string() }))
      .parse(
        await client`SELECT DISTINCT tableowner AS owner FROM pg_tables WHERE schemaname IN ('public', 'drizzle') UNION SELECT nspowner::regrole::text FROM pg_namespace WHERE nspname IN ('public', 'drizzle')`,
      );

    expect(owners).toEqual([{ owner: DATABASE_ROLES.migrator }]);
  });

  it("denies PUBLIC any database or schema privilege", async () => {
    const client = connectAs(DATABASE_ROLES.migrator);
    const [publicAccess] = z
      .tuple([
        z.object({
          canConnect: z.boolean(),
          canCreateSchema: z.boolean(),
          canUseSchema: z.boolean(),
        }),
      ])
      .parse(
        await client`SELECT has_database_privilege('public', current_database(), 'CONNECT') AS "canConnect", has_schema_privilege('public', 'public', 'CREATE') AS "canCreateSchema", has_schema_privilege('public', 'public', 'USAGE') AS "canUseSchema"`,
      );

    expect(publicAccess).toEqual({
      canConnect: false,
      canCreateSchema: false,
      canUseSchema: false,
    });
  });

  it("stops every runtime role from changing the schema or reading migrations", async () => {
    for (const role of runtimeRoles) {
      const client = connectAs(role);

      await expectPermissionDenied(client`CREATE TABLE grants_probe (id int)`);
      await expectPermissionDenied(
        client`SELECT * FROM drizzle.__drizzle_migrations`,
      );
    }
  });

  it("keeps the operator role read-only", async () => {
    const client = connectAs(DATABASE_ROLES.cli);

    await expectPermissionDenied(
      client`UPDATE users_profile SET first_name = first_name WHERE false`,
    );
    await expectPermissionDenied(client`DELETE FROM users_profile WHERE false`);
  });
});
