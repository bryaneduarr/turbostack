import type { environmentFilePath } from "@workspace/setup/doctor/preflight/read-environment-file.service";
import type { z } from "zod";

/** Pairs one app's env file with the schemas its production containers parse and the values Compose sets for them. */
export interface ProductionEnvironmentFile {
  /** Names the app whose env file the operator edits in production. */
  readonly app: Parameters<typeof environmentFilePath>[0];
  /** Lists the schemas that must accept the file's values once the Compose overrides apply. */
  readonly schemas: readonly z.ZodType[];
  /** Maps variable names to the values Compose sets for the containers that read this file, replacing the file's values. */
  readonly composeOverrides: Readonly<Record<string, string>>;
}
