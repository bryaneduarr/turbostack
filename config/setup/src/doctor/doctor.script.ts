import { printDoctorFailures } from "@workspace/setup/doctor/doctor-report.module";
import { runDoctor } from "@workspace/setup/doctor/run-doctor.module";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";

const production = Bun.argv.includes("--production");

function describeUnexpectedError(error: unknown): DoctorFailure {
  return {
    summary: "The doctor stopped unexpectedly",
    reason: error instanceof Error ? error.message : String(error),
    fix: "bun install",
  };
}

let failures: readonly DoctorFailure[];
try {
  failures = await runDoctor({ production });
} catch (error) {
  failures = [describeUnexpectedError(error)];
}

if (failures.length > 0) {
  printDoctorFailures(failures);
  process.exit(1);
}

console.info("The environment is ready.");
