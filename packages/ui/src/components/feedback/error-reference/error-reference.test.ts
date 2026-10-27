import { describe, expect, it } from "bun:test";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { ErrorReference } from "@workspace/ui/components/feedback/error-reference/error-reference.component";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

describe("error reference", () => {
  it("shows the error code and the request ID with a copy action", () => {
    const requestId = crypto.randomUUID();
    const markup = renderToStaticMarkup(
      createElement(ErrorReference, {
        reference: { code: SUPPORT_ERROR_CODE.API_FORBIDDEN, requestId },
        tone: "default",
      }),
    );

    expect(markup).toContain(
      `>Error code ${SUPPORT_ERROR_CODE.API_FORBIDDEN} · ID ${requestId}</p>`,
    );
    expect(markup).toContain(">Copy</button>");
  });

  it("omits the request ID when the reference has none", () => {
    const markup = renderToStaticMarkup(
      createElement(ErrorReference, {
        reference: {
          code: SUPPORT_ERROR_CODE.NET_UNREACHABLE,
          requestId: null,
        },
        tone: "muted",
      }),
    );

    expect(markup).toContain(
      `>Error code ${SUPPORT_ERROR_CODE.NET_UNREACHABLE}</p>`,
    );
    expect(markup).not.toContain("·");
  });
});
