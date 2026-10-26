import { existsSync } from "node:fs";
import { clientEnvSchema } from "@workspace/schemas/client/environment/client-env.schema";
import { databaseCliEnvSchema } from "@workspace/schemas/database/environment/cli/database-cli-env.schema";
import { databaseMigratorEnvSchema } from "@workspace/schemas/database/environment/migrator/database-migrator-env.schema";
import { databaseProvisionEnvSchema } from "@workspace/schemas/database/environment/provision/database-provision-env.schema";
import { serverEnvSchema } from "@workspace/schemas/server/environment/server-env.schema";
import {
  environmentFilePath,
  readEnvironmentFile,
} from "@workspace/setup/doctor/preflight/read-environment-file.service";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";
import type { ProductionEnvironmentFile } from "@workspace/setup/types/doctor/production/production-environment.interface";

const composeApiServerUrl = "http://api-server:3001";

export function productionEnvironmentFiles(): readonly ProductionEnvironmentFile[] {
  return [
    {
      app: "server",
      schemas: [
        serverEnvSchema,
        databaseMigratorEnvSchema,
        databaseCliEnvSchema,
        databaseProvisionEnvSchema,
      ],
      composeOverrides: {
        NODE_ENV: "production",
        DB_HOST: "postgres",
        DB_PORT: "5432",
        DB_SSL_MODE: "disable",
        PORT: "3001",
      },
    },
    {
      app: "client",
      schemas: [clientEnvSchema],
      composeOverrides: {
        SERVER_URL: composeApiServerUrl,
      },
    },
  ];
}

export async function checkProductionEnvironment(): Promise<
  readonly DoctorFailure[]
> {
  const failures = await Promise.all(
    productionEnvironmentFiles().map(checkProductionEnvironmentFile),
  );
  return failures.flat();
}

async function checkProductionEnvironmentFile(
  file: ProductionEnvironmentFile,
): Promise<readonly DoctorFailure[]> {
  const fileName = `apps/${file.app}/.env`;
  const path = environmentFilePath(file.app);
  if (!existsSync(path)) {
    return [
      {
        summary: `${fileName} is missing.`,
        reason:
          "Production never generates values, so each one must be set in this file.",
        fix: `Create ${fileName} from its .env.example and set its production values; see docs/run-production-locally.md.`,
      },
    ];
  }

  return productionValueFailures(file, await readEnvironmentFile(path));
}

export function productionValueFailures(
  file: ProductionEnvironmentFile,
  values: Readonly<Record<string, string>>,
): readonly DoctorFailure[] {
  const fileName = `apps/${file.app}/.env`;
  const failures = new Map<string, DoctorFailure>();
  const containerValues = {
    ...withoutBlankValues(values),
    ...file.composeOverrides,
  };
  for (const schema of file.schemas) {
    const result = schema.safeParse(containerValues);
    if (result.success) continue;
    for (const issue of result.error.issues) {
      const name =
        issue.path.length > 0 ? String(issue.path[0]) : "environment";
      if (!failures.has(name)) {
        failures.set(name, missingValueFailure(name, fileName, issue.message));
      }
    }
  }
  return [...failures.values()];
}

function withoutBlankValues(
  values: Readonly<Record<string, string>>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== ""),
  );
}

function missingValueFailure(
  name: string,
  fileName: string,
  reason: string,
): DoctorFailure {
  return {
    summary: `${name} is missing or invalid in ${fileName}.`,
    reason,
    fix: `Set ${name} in ${fileName}; see docs/run-production-locally.md.`,
  };
}
