import { describe, expect, it } from "bun:test";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { FailureAlert } from "@workspace/ui/components/feedback/failure-alert/failure-alert.component";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

describe("failure alert", () => {
  it("shows the message and the support reference", () => {
    const requestId = crypto.randomUUID();
    const markup = renderToStaticMarkup(
      createElement(FailureAlert, {
        message: "The role could not be saved.",
        reference: {
          code: SUPPORT_ERROR_CODE.API_INTERNAL_SERVER_ERROR,
          requestId,
        },
      }),
    );

    expect(markup).toContain(">The role could not be saved.</p>");
    expect(markup).toContain(
      `>Error code ${SUPPORT_ERROR_CODE.API_INTERNAL_SERVER_ERROR} · ID ${requestId}</p>`,
    );
  });
});
