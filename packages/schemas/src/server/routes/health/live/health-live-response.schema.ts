import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import { z } from "zod";

export const healthLiveResponseSchema = createSuccessResponseSchema(
  z.object({
    /* Confirms the process is running and able to serve HTTP requests. */
    status: z.literal("alive"),
  }),
);
