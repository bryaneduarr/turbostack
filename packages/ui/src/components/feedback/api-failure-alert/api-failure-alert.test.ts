import { describe, expect, it } from "bun:test";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { ApiFailureAlert } from "@workspace/ui/components/feedback/api-failure-alert/api-failure-alert.component";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

describe("API failure alert", () => {
  it("shows the API message and its network reference when the API is unreachable", () => {
    const markup = renderToStaticMarkup(
      createElement(ApiFailureAlert, {
        result: { kind: "unreachable", cause: new Error("Connection refused") },
      }),
    );

    expect(markup).toContain(">The API could not be reached.</p>");
    expect(markup).toContain(
      `>Error code ${SUPPORT_ERROR_CODE.NET_UNREACHABLE}</p>`,
    );
  });
});
