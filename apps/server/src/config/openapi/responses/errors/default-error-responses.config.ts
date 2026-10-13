import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { OpenAPIV3 } from "openapi-types";

const errorResponse = {
  headers: { "X-Request-ID": { $ref: "#/components/headers/RequestId" } },
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

export const errorResponseComponents = {
  BadRequest: {
    ...errorResponse,
    description: `${BAD_REQUEST}: malformed request (PARSE) or rejected input (REQUEST_ERROR).`,
  },
  Unauthorized: {
    ...errorResponse,
    description: `${UNAUTHORIZED}: authentication required (UNAUTHORIZED).`,
  },
  Forbidden: {
    ...errorResponse,
    description: `${FORBIDDEN}: access denied (FORBIDDEN).`,
  },
  NotFound: {
    ...errorResponse,
    description: `${NOT_FOUND}: resource or route not found (NOT_FOUND).`,
  },
  ValidationError: {
    ...errorResponse,
    description: `${UNPROCESSABLE_ENTITY}: request validation failed (VALIDATION). No submitted values are returned.`,
  },
  InternalServerError: {
    ...errorResponse,
    description: `${INTERNAL_SERVER_ERROR}: unexpected server error (INTERNAL_SERVER_ERROR). Use requestId for support; exception details remain private.`,
  },
  RequestError: {
    ...errorResponse,
    description:
      "Other 4xx/5xx failures use the same envelope and an appropriate HTTP status. No raw exception details are returned.",
  },
} satisfies Record<string, OpenAPIV3.ResponseObject>;

export const defaultErrorResponses = {
  [BAD_REQUEST]: { $ref: "#/components/responses/BadRequest" },
  [UNAUTHORIZED]: { $ref: "#/components/responses/Unauthorized" },
  [FORBIDDEN]: { $ref: "#/components/responses/Forbidden" },
  [NOT_FOUND]: { $ref: "#/components/responses/NotFound" },
  [UNPROCESSABLE_ENTITY]: { $ref: "#/components/responses/ValidationError" },
  [INTERNAL_SERVER_ERROR]: {
    $ref: "#/components/responses/InternalServerError",
  },
  default: { $ref: "#/components/responses/RequestError" },
} satisfies OpenAPIV3.ResponsesObject;
