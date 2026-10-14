import type { ValidatedClientEnvironment } from "@workspace/schemas/client/environment/client-env.interface";
import { clientEnvSchema } from "@workspace/schemas/client/environment/client-env.schema";

// Read at request time so one build can run against any environment's API.
export function getClientEnvironment(): ValidatedClientEnvironment {
  return clientEnvSchema.parse(process.env);
}
