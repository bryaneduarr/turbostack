import { describe, expect, it, mock } from "bun:test";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const geistFontMock = () => ({ variable: "geist-test-font" });

mock.module("next/font/google", () => ({ Geist: geistFontMock }));

const { default: GlobalError } = await import("@/app/global-error");

describe("client root crash page", () => {
  it("shows PAGE-002 with the Next.js digest of a root crash", () => {
    const error = Object.assign(new Error("Root layout failed"), {
      digest: "3121905425",
    });

    const markup = renderToStaticMarkup(
      createElement(GlobalError, { error, reset: () => undefined }),
    );

    expect(markup).toContain("<html");
    expect(markup).toContain(
      `Error code ${SUPPORT_ERROR_CODE.PAGE_CRASHED} · ID 3121905425`,
    );
  });
});
