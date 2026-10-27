import { describe, expect, it } from "bun:test";
import { findSourceComments } from "@workspace/rules/services/comments/find-source-comments.service";

describe("findSourceComments", () => {
  it("finds line and block comments with their lines", () => {
    const comments = findSourceComments(
      ["// First.", "const a = 1;", "/* Second", "   spans. */"].join("\n"),
    );

    expect(comments).toEqual([
      { kind: "line", startLine: 1, endLine: 1, text: " First." },
      { kind: "block", startLine: 3, endLine: 4, text: " Second\n   spans. " },
    ]);
  });

  it("ignores comment markers inside strings and template literals", () => {
    const comments = findSourceComments(
      [
        'const url = "https://example.com";',
        // biome-ignore lint/suspicious/noTemplateCurlyInString: The scanner reads template literal source text.
        "const path = `//${host}/* not */`;",
        "const quote = 'a // b';",
      ].join("\n"),
    );

    expect(comments).toEqual([]);
  });

  it("ignores slashes inside regular expressions but not after division", () => {
    const comments = findSourceComments(
      [
        "const pattern = /https?:\\/\\//;",
        "const half = total / 2; // Halves it.",
      ].join("\n"),
    );

    expect(comments).toEqual([
      { kind: "line", startLine: 2, endLine: 2, text: " Halves it." },
    ]);
  });

  it("finds comments inside template expressions", () => {
    const comments = findSourceComments(
      // biome-ignore lint/suspicious/noTemplateCurlyInString: The scanner reads template literal source text.
      "const value = `${read({ id }) /* Inline. */}`; // After.",
    );

    expect(comments.map(({ text }) => text)).toEqual([" Inline. ", " After."]);
  });
});
