import { describe, expect, it } from "bun:test";
import { describeApiFailure } from "@workspace/api-client/results/api-failure/describe-api-failure.service";
import { FORBIDDEN } from "@workspace/utils/http/status-codes/http-status-code.constant";

describe("describing an API failure", () => {
  it("returns the server message of a forbidden failure unchanged", () => {
    const message =
      "Your account is banned. Reason: Abuse. Contact help@example.com for help.";

    expect(
      describeApiFailure({
        kind: "failure",
        response: {
          success: false,
          message,
          data: null,
          error: { code: "FORBIDDEN" },
          status: FORBIDDEN,
          requestId: crypto.randomUUID(),
        },
      }),
    ).toBe(message);
  });
});
