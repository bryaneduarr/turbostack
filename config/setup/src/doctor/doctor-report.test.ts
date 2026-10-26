import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import {
  formatDoctorFailure,
  printDoctorFailures,
} from "@workspace/setup/doctor/doctor-report.module";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";

const missingEnvironmentFile: DoctorFailure = {
  summary: "apps/client/.env is missing.",
  reason: "The client app cannot start without its environment file",
  fix: "bun run setup:env",
};

const missingSessionKey: DoctorFailure = {
  summary: "AUTH_JWT_PRIVATE_JWK is missing.",
  reason: "The server cannot sign\nsession   tokens without it.",
  fix: "bun run generate:session-keys",
};

describe("formatDoctorFailure", () => {
  it("returns one line with the summary, reason, and a single Fix command", () => {
    expect(formatDoctorFailure(missingEnvironmentFile)).toBe(
      "apps/client/.env is missing: The client app cannot start without its environment file. Fix: bun run setup:env",
    );
  });

  it("collapses line breaks and repeated spaces in the reason", () => {
    expect(formatDoctorFailure(missingSessionKey)).toBe(
      "AUTH_JWT_PRIVATE_JWK is missing: The server cannot sign session tokens without it. Fix: bun run generate:session-keys",
    );
  });

  it("emits one period when the summary and reason already end in punctuation", () => {
    const line = formatDoctorFailure({
      summary: "Zod check failed!",
      reason: "The value is not valid.",
      fix: "bun run setup:env",
    });

    expect(line).toBe(
      "Zod check failed: The value is not valid. Fix: bun run setup:env",
    );
  });
});

describe("printDoctorFailures", () => {
  afterEach(() => {
    mock.restore();
  });

  it("writes one line per failure to stderr, in order, and nothing to stdout", () => {
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    const logSpy = spyOn(console, "log").mockImplementation(() => {});

    printDoctorFailures([missingEnvironmentFile, missingSessionKey]);

    expect(errorSpy.mock.calls).toEqual([
      [formatDoctorFailure(missingEnvironmentFile)],
      [formatDoctorFailure(missingSessionKey)],
    ]);
    expect(logSpy).not.toHaveBeenCalled();
  });
});
