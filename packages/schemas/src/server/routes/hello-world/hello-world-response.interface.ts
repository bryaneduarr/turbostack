import type { helloWorldResponseSchema } from "@workspace/schemas/server/routes/hello-world/hello-world-response.schema";
import type { z } from "zod";

/* Represents the validated greeting envelope whose protocol payload is explicitly null. */
export interface HelloWorldResponse
  extends z.output<typeof helloWorldResponseSchema> {}
