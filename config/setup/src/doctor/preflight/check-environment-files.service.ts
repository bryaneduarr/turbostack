import { existsSync } from "node:fs";
import { clientEnvSchema } from "@workspace/schemas/client/environment/client-env.schema";
import { serverEnvSchema } from "@workspace/schemas/server/environment/server-env.schema";
import {
  environmentFilePath,
  readEnvironmentFile,
} from "@workspace/setup/doctor/preflight/read-environment-file.service";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";
import type { EnvironmentApp } from "@workspace/setup/types/doctor/preflight/environment-app.interface";
import type { z } from "zod";

const environmentFileChecks = [
  {
    app: "server",
    parsers: [serverEnvSchema],
    defaults: {},
  },
  {
    app: "client",
    parsers: [clientEnvSchema],
    defaults: { NODE_ENV: "development" },
  },
] as const;

export async function checkEnvironmentFiles(): Promise<
  readonly DoctorFailure[]
> {
  const failures = await Promise.all(
    environmentFileChecks.map((check) => checkEnvironmentFile(check)),
  );
  return failures.flat();
}

async function checkEnvironmentFile({
  app,
  parsers,
  defaults,
}: {
  readonly app: EnvironmentApp;
  readonly parsers: readonly z.ZodType[];
  readonly defaults: Readonly<Record<string, string>>;
}): Promise<readonly DoctorFailure[]> {
  const path = environmentFilePath(app);
  if (!existsSync(path)) {
    return [
      {
        summary: `apps/${app}/.env is missing`,
        reason: `The ${app} app cannot start without its environment file.`,
        fix: "bun run setup:env",
      },
    ];
  }
  const values = { ...defaults, ...(await readEnvironmentFile(path)) };
  const failures = parsers.flatMap((parser) =>
    invalidVariableFailures(app, parser.safeParse(values)),
  );
  return uniqueBySummary(failures);
}

function invalidVariableFailures(
  app: EnvironmentApp,
  outcome: z.ZodSafeParseResult<unknown>,
): readonly DoctorFailure[] {
  if (outcome.success) return [];
  return outcome.error.issues.map((issue) => {
    const variable = issue.path.map(String).join(".") || "environment";
    return {
      summary: `apps/${app}/.env: ${variable} is invalid`,
      reason: issue.message,
      fix: "bun run setup:env",
    };
  });
}

function uniqueBySummary(
  failures: readonly DoctorFailure[],
): readonly DoctorFailure[] {
  return [
    ...new Map(
      failures.map((failure): [string, DoctorFailure] => [
        failure.summary,
        failure,
      ]),
    ).values(),
  ];
}
