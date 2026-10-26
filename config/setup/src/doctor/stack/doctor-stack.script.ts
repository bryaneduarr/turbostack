import { printDoctorFailures } from "@workspace/setup/doctor/doctor-report.module";
import {
  environmentFilePath,
  readEnvironmentFile,
} from "@workspace/setup/doctor/preflight/read-environment-file.service";
import { checkDatabaseStack } from "@workspace/setup/doctor/stack/check-database-stack.service";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";

function processEnvironment(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
}

async function runStackChecks(): Promise<readonly DoctorFailure[]> {
  // Process values override the file, matching how Bun loads the API's environment.
  const serverEnvironment = {
    ...(await readEnvironmentFile(environmentFilePath("server"))),
    ...processEnvironment(),
  };
  return checkDatabaseStack(serverEnvironment);
}

function unexpectedFailure(error: unknown): DoctorFailure {
  return {
    summary: "Stack check could not finish",
    reason: error instanceof Error ? error.message : String(error),
    fix: "bun run doctor",
  };
}

async function main(): Promise<number> {
  const failures = await runStackChecks().catch((error: unknown) => [
    unexpectedFailure(error),
  ]);
  if (failures.length > 0) {
    printDoctorFailures(failures);
    return 1;
  }
  console.info("Development stack is ready.");
  return 0;
}

process.exit(await main());
