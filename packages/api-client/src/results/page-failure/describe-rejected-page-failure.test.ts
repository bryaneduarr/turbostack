import { describe, expect, it } from "bun:test";
import { describeRejectedPageFailure } from "@workspace/api-client/results/page-failure/describe-rejected-page-failure.service";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";

describe("describing a rejected page failure", () => {
  it("keeps the message and gives the page code with no request ID", () => {
    const message = "This account link is not valid.";

    expect(describeRejectedPageFailure(message)).toEqual({
      kind: "failed",
      message,
      reference: { code: SUPPORT_ERROR_CODE.PAGE_REJECTED, requestId: null },
    });
  });
});
