import type { serverEnvSchema } from "@workspace/schemas/server/environment/server-env.schema";
import type { z } from "zod";

/* Contains validated server configuration with all defaults resolved at startup. */
export interface ValidatedServerEnvironment
  extends z.output<typeof serverEnvSchema> {}
