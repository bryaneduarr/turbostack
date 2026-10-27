import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";

export function formatDoctorFailure(failure: DoctorFailure): string {
  const summary = failure.summary.replace(/[.!?]+$/u, "");
  const reason = failure.reason.replace(/[.!?]+$/u, "");
  const line = `${summary}: ${reason}. Fix: ${failure.fix}`;
  return line.replace(/\s+/gu, " ");
}

export function printDoctorFailures(failures: readonly DoctorFailure[]): void {
  for (const failure of failures) {
    console.error(formatDoctorFailure(failure));
  }
}
