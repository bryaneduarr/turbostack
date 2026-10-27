import { describe, expect, it } from "bun:test";
import {
  productionEnvironmentFiles,
  productionValueFailures,
} from "@workspace/setup/doctor/production/check-production-environment.service";
import type { ProductionEnvironmentFile } from "@workspace/setup/types/doctor/production/production-environment.interface";

const serverValues: Readonly<Record<string, string>> = {
  NODE_ENV: "production",
  PORT: "3001",
  DB_HOST: "localhost",
  DB_PORT: "5433",
  DB_NAME: "app",
  DB_ADMIN_USER: "postgres",
  DB_ADMIN_PASSWORD: "example-admin-password",
  DB_MIGRATOR_USER: "app_migrator",
  DB_MIGRATOR_PASSWORD: "example-migrator-password",
  DB_USER: "app_runtime",
  DB_PASSWORD: "example-runtime-password",
  DB_CLI_USER: "app_cli",
  DB_CLI_PASSWORD: "example-cli-password",
};

const clientValues: Readonly<Record<string, string>> = {
  NODE_ENV: "production",
  SERVER_URL: "https://api.example.com",
};

function fileFor(
  app: ProductionEnvironmentFile["app"],
): ProductionEnvironmentFile {
  const file = productionEnvironmentFiles().find(
    (candidate) => candidate.app === app,
  );
  if (file === undefined) throw new Error(`No production file for ${app}.`);
  return file;
}

describe("productionValueFailures for the server", () => {
  it("accepts complete values, including the example placeholder passwords", () => {
    expect(productionValueFailures(fileFor("server"), serverValues)).toEqual(
      [],
    );
  });

  it("names a blank required value and the file that holds it", () => {
    const failures = productionValueFailures(fileFor("server"), {
      ...serverValues,
      DB_PASSWORD: "",
    });

    expect(failures).toEqual([
      {
        summary: "DB_PASSWORD is missing or invalid in apps/server/.env.",
        reason: expect.any(String),
        fix: "Set DB_PASSWORD in apps/server/.env; see docs/run-production-locally.md.",
      },
    ]);
  });

  it("lets Compose overrides replace invalid or production-inconsistent file values", () => {
    const failures = productionValueFailures(fileFor("server"), {
      ...serverValues,
      DB_HOST: "",
      DB_PORT: "not-a-port",
      NODE_ENV: "development",
    });

    expect(failures).toEqual([]);
  });

  it("rejects a runtime user that is not the provisioned role", () => {
    const failures = productionValueFailures(fileFor("server"), {
      ...serverValues,
      DB_USER: "postgres",
    });

    expect(failures.map((failure) => failure.summary)).toEqual([
      "DB_USER is missing or invalid in apps/server/.env.",
    ]);
  });
});

describe("productionValueFailures for the client", () => {
  it("replaces the file's SERVER_URL with the Compose API address", () => {
    const failures = productionValueFailures(fileFor("client"), {
      ...clientValues,
      SERVER_URL: "not a url",
    });

    expect(failures).toEqual([]);
  });
});
