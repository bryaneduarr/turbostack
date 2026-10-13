import type { OpenAPIV3 } from "openapi-types";

export const requestIdHeader = {
  description:
    "Server-generated correlation ID. Matches requestId in the JSON response body; client-supplied IDs are not reused.",
  required: true,
  schema: { type: "string", format: "uuid" },
} satisfies OpenAPIV3.HeaderObject;
