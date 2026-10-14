import type { healthLiveResponseSchema } from "@workspace/schemas/server/routes/health/live/health-live-response.schema";
import type { z } from "zod";

/* Represents the validated liveness envelope confirming the process serves HTTP. */
export interface HealthLiveResponse
  extends z.output<typeof healthLiveResponseSchema> {}
