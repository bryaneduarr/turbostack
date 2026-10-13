import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import { z } from "zod";

export const successResponseSchema = createSuccessResponseSchema(z.unknown());
export const jsonResponseDataSchema = z.json();
