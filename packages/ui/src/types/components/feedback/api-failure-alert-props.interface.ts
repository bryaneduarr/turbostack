import type { ApiFailureResult } from "@workspace/api-client/types/requests/send-api-request.interface";

/** Configures an error alert built from a failed API request result. */
export interface ApiFailureAlertProps {
  /** Carries the failed API result that supplies the message and the support reference. */
  result: ApiFailureResult;
}
