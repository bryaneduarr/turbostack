import { describe, expect, it } from "bun:test";
import { createApiFailureError } from "@workspace/api-client/results/crash-error/create-api-failure-error.service";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { INTERNAL_SERVER_ERROR } from "@workspace/utils/http/status-codes/http-status-code.constant";

describe("creating an API failure error", () => {
  it("names the message, support code, and request ID of a failure", () => {
    const requestId = crypto.randomUUID();

    const error = createApiFailureError({
      kind: "failure",
      response: {
        success: false,
        message: "The server failed unexpectedly.",
        data: null,
        error: { code: "INTERNAL_SERVER_ERROR" },
        status: INTERNAL_SERVER_ERROR,
        requestId,
      },
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("The server failed unexpectedly.");
    expect(error.message).toContain(
      SUPPORT_ERROR_CODE.API_INTERNAL_SERVER_ERROR,
    );
    expect(error.message).toContain(requestId);
  });

  it("says no request ID exists for an unreachable API", () => {
    const error = createApiFailureError({
      kind: "unreachable",
      cause: new TypeError("fetch failed"),
    });

    expect(error.message).toContain("The API could not be reached.");
    expect(error.message).toContain(SUPPORT_ERROR_CODE.NET_UNREACHABLE);
    expect(error.message).toContain("Request ID: none");
  });
});
