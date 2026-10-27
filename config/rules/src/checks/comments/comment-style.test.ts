import { describe, expect, it } from "bun:test";
import { commentStyleCheck } from "@workspace/rules/checks/comments/comment-style.check";
import { createSourceFile } from "@workspace/rules/services/files/create-source-file.service";

function messagesFor(lines: string[]): string[] {
  return commentStyleCheck
    .check(createSourceFile("apps/server/src/x/x.service.ts", lines.join("\n")))
    .map(({ message }) => message);
}

describe("commentStyleCheck", () => {
  it("accepts plain sentences, multi-line sentences, and tool directives", () => {
    expect(
      messagesFor([
        "// Tests share one database, so each file removes",
        "// only what it created.",
        "/* Identifies the account. */",
        "// biome-ignore lint/suspicious/noConsole: The CLI prints results",
        "const url = 'https://example.com'; // Kept for the redirect check.",
      ]),
    ).toEqual([]);
  });

  it("reports each banned style", () => {
    expect(
      messagesFor([
        "// Why: the cache is cold.",
        "// 1. Load the account.",
        "// ------------------",
        "// Retries twice — then fails.",
        "// Keeps output human readable.",
        "// Call this before you render.",
        "// Missing the final period",
      ]),
    ).toEqual([
      "Do not prefix comments with Why: or What:.",
      "Do not write numbered step comments.",
      "Do not use decorative separators in comments.",
      "Use plain keyboard characters in comments, not em dashes or Unicode.",
      'Do not mention "human readable", "human friendly", or "human-like".',
      "Avoid pronouns addressing the reader.",
      "End complete comment sentences with a period.",
    ]);
  });
});
