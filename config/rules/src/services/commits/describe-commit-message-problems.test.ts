import { describe, expect, it } from "bun:test";
import { describeCommitMessageProblems } from "@workspace/rules/services/commits/describe-commit-message-problems.service";

describe("describeCommitMessageProblems", () => {
  it("accepts a conventional title with a wrapped body", () => {
    expect(
      describeCommitMessageProblems(
        "fix(server): keep error status codes\n\nThe handler keeps the original status so clients can\ntell failures apart.\n",
      ),
    ).toEqual([]);
  });

  it("rejects long titles, missing bodies, and long body lines", () => {
    expect(
      describeCommitMessageProblems(
        "refactor(client): split e2e fixture contracts and dedupe helpers",
      ),
    ).toEqual([
      "Title is 64 characters; keep it at 50 or fewer.",
      "Add a body after one blank line explaining what changed and why.",
    ]);
    expect(
      describeCommitMessageProblems(`docs: wrap\n\n${"word ".repeat(16)}`),
    ).toHaveLength(1);
  });

  it("rejects non-conventional titles, trailing periods, and attribution", () => {
    expect(
      describeCommitMessageProblems("Update files.\n\nBody text here.\n"),
    ).toHaveLength(2);
    expect(
      describeCommitMessageProblems(
        "fix: keep codes\n\nBody text.\n\nCo-Authored-By: Claude <noreply@example.com>\n",
      ),
    ).toEqual(["Remove AI or tool attribution."]);
  });

  it("allows an unbreakable long URL line", () => {
    expect(
      describeCommitMessageProblems(
        `docs: link the guide\n\nSee the guide:\nhttps://example.com/${"a".repeat(80)}\n`,
      ),
    ).toEqual([]);
  });
});
