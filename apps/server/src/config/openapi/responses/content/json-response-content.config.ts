import type { OpenAPIV3 } from "openapi-types";
import { z } from "zod";

export function jsonContent<T extends z.ZodType>(
  schema: T,
  description: string,
) {
  return {
    headers: { "X-Request-ID": { $ref: "#/components/headers/RequestId" } },
    content: {
      "application/json": {
        // The OpenAPI target emits a 3.0 schema despite Zod's broader JSON Schema return type.
        schema: z.toJSONSchema(schema, {
          target: "openapi-3.0",
          io: "output",
        }) as OpenAPIV3.SchemaObject,
      },
    },
    description,
  };
}
