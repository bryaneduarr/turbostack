import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";
import type { Logger } from "pino";

/* Distinguishes requests without an error response from classified failures. */
export type RequestLogOutcome =
  | { kind: "pending" }
  | { kind: "failed"; code: ErrorResponse["error"]["code"] };

/* Represents whether an arbitrary thrown value was captured for safe serialization. */
export type RequestLogDiagnostic =
  | { kind: "none" }
  | { kind: "captured"; cause: unknown };

/* Tracks request timing, correlation, and explicit diagnostic states. */
export interface RequestLogEntry {
  /* Records the monotonic start time used to calculate request duration. */
  started: number;
  /* Contains the server-generated correlation ID for this request. */
  requestId: string;
  /* Emits request-scoped logs with safe method and correlation bindings. */
  logger: Logger;
  /* Records a classified failure only after an error response is created. */
  outcome: RequestLogOutcome;
  /* Preserves thrown values, including null or undefined, only when captured. */
  diagnostic: RequestLogDiagnostic;
}
