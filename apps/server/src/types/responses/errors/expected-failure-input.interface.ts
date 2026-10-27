import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";
import type { expectedFailureStatuses } from "@/services/responses/errors/expected-failure-statuses.config";

/** Describes an anticipated request failure raised deliberately by route logic. */
export interface ExpectedFailureInput {
  /** Classifies the failure for clients and selects its HTTP status. */
  code: keyof typeof expectedFailureStatuses;
  /** Explains the specific failure to clients without private details. */
  message: ErrorResponse["message"];
}
