import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import { z } from "zod";

export const healthReadyResponseSchema = createSuccessResponseSchema(
  z.object({
    /* Confirms the instance can accept traffic that depends on its backing services. */
    status: z.literal("ready"),
    /* Confirms PostgreSQL answered a query; it does not verify tables or migrations. */
    database: z.literal("up"),
  }),
);
