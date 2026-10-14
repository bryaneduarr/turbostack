import { expectedFailureStatuses } from "@/services/responses/errors/expected-failure-statuses.config";
import type { ExpectedFailureInput } from "@/types/responses/errors/expected-failure-input.interface";

export class ExpectedFailure extends Error {
  readonly code: ExpectedFailureInput["code"];
  readonly status: (typeof expectedFailureStatuses)[ExpectedFailureInput["code"]];

  constructor({ code, message }: ExpectedFailureInput) {
    super(message);
    this.name = "ExpectedFailure";
    this.code = code;
    this.status = expectedFailureStatuses[code];
  }
}
