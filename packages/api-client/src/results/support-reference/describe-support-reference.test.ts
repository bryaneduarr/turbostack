import { describe, expect, it } from "bun:test";
import { describeSupportReference } from "@workspace/api-client/results/support-reference/describe-support-reference.service";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import {
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  SERVICE_UNAVAILABLE,
  UNAUTHORIZED,
} from "@workspace/utils/http/status-codes/http-status-code.constant";

describe("describing a support reference", () => {
  it.each([
    ["NOT_FOUND", SUPPORT_ERROR_CODE.API_NOT_FOUND, NOT_FOUND],
    ["VALIDATION", SUPPORT_ERROR_CODE.API_VALIDATION, BAD_REQUEST],
    ["PARSE", SUPPORT_ERROR_CODE.API_PARSE, BAD_REQUEST],
    ["UNAUTHORIZED", SUPPORT_ERROR_CODE.API_UNAUTHORIZED, UNAUTHORIZED],
    ["FORBIDDEN", SUPPORT_ERROR_CODE.API_FORBIDDEN, FORBIDDEN],
    ["CONFLICT", SUPPORT_ERROR_CODE.API_CONFLICT, CONFLICT],
    [
      "SERVICE_UNAVAILABLE",
      SUPPORT_ERROR_CODE.API_SERVICE_UNAVAILABLE,
      SERVICE_UNAVAILABLE,
    ],
    ["REQUEST_ERROR", SUPPORT_ERROR_CODE.API_REQUEST_ERROR, BAD_REQUEST],
    [
      "INTERNAL_SERVER_ERROR",
      SUPPORT_ERROR_CODE.API_INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR,
    ],
  ] as const)(
    "maps the API failure code %s to its support code with the response request ID",
    (apiCode, supportCode, status) => {
      const requestId = crypto.randomUUID();

      expect(
        describeSupportReference({
          kind: "failure",
          response: {
            success: false,
            message: "The request failed.",
            data: null,
            error: { code: apiCode },
            status,
            requestId,
          },
        }),
      ).toEqual({ code: supportCode, requestId });
    },
  );

  it("maps an unexpected response to the network code with the header request ID", () => {
    const requestId = crypto.randomUUID();

    expect(
      describeSupportReference({
        kind: "unexpected-response",
        status: OK,
        requestId,
      }),
    ).toEqual({ code: SUPPORT_ERROR_CODE.NET_UNEXPECTED_RESPONSE, requestId });
  });

  it("keeps a null request ID for an unexpected response without a valid header", () => {
    expect(
      describeSupportReference({
        kind: "unexpected-response",
        status: BAD_GATEWAY,
        requestId: null,
      }),
    ).toEqual({
      code: SUPPORT_ERROR_CODE.NET_UNEXPECTED_RESPONSE,
      requestId: null,
    });
  });

  it("maps an unreachable API to the network code without a request ID", () => {
    expect(
      describeSupportReference({
        kind: "unreachable",
        cause: new TypeError("fetch failed"),
      }),
    ).toEqual({ code: SUPPORT_ERROR_CODE.NET_UNREACHABLE, requestId: null });
  });
});
