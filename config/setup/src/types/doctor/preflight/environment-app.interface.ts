import type { environmentFilePath } from "@workspace/setup/doctor/preflight/read-environment-file.service";

/** Names the app whose environment file a preflight check reads. */
export type EnvironmentApp = Parameters<typeof environmentFilePath>[0];
