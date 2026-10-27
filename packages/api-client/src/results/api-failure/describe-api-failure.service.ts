import type { ApiFailureResult } from "@workspace/api-client/types/requests/send-api-request.interface";

export function describeApiFailure(result: ApiFailureResult): string {
  if (result.kind === "failure") return result.response.message;
  if (result.kind === "unexpected-response") {
    return `The API answered with an unexpected ${result.status} response.`;
  }
  return "The API could not be reached.";
}
