import type { clientEnvSchema } from "@workspace/schemas/client/environment/client-env.schema";
import type { z } from "zod";

/** Contains the validated runtime settings of the web client's server. */
export interface ValidatedClientEnvironment
  extends z.output<typeof clientEnvSchema> {}
