import type { healthReadyResponseSchema } from "@workspace/schemas/server/routes/health/ready/health-ready-response.schema";
import type { z } from "zod";

/* Represents the validated readiness envelope confirming backing services respond. */
export interface HealthReadyResponse
  extends z.output<typeof healthReadyResponseSchema> {}
