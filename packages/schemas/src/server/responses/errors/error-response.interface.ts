import type { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import type { z } from "zod";

/** Represents a validated failure envelope with an explicit null success payload. */
export interface ErrorResponse extends z.output<typeof errorResponseSchema> {}
