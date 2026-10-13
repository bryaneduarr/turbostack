import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import { z } from "zod";

// This greeting deliberately has no domain payload in the published protocol.
export const helloWorldResponseSchema = createSuccessResponseSchema(z.null());
