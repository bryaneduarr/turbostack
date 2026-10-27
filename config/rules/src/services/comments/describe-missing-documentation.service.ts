import type { CommentAbove } from "@workspace/rules/types/comments/comment-above.interface";

const problems: Readonly<Record<CommentAbove, string | null>> = {
  "documentation-block": null,
  block: "Use a /** ... */ JSDoc comment, not /* ... */,",
  line: "Use a /** ... */ JSDoc comment, not //,",
  none: "Add a brief /** ... */ JSDoc comment",
};

export function describeMissingDocumentation(
  commentAbove: CommentAbove,
  subject: string,
): string | null {
  const problem = problems[commentAbove];
  return problem === null ? null : `${problem} above ${subject}.`;
}
