import type { SourceComment } from "@workspace/rules/types/comments/source-comment.interface";

// Consecutive line comments read as one comment, so only the last line needs
// to end the sentence.
export function groupLineComments(
  comments: readonly SourceComment[],
): SourceComment[] {
  const grouped: SourceComment[] = [];
  for (const comment of comments) {
    const previous = grouped.at(-1);
    if (
      previous !== undefined &&
      previous.kind === "line" &&
      comment.kind === "line" &&
      comment.startLine === previous.endLine + 1
    ) {
      grouped[grouped.length - 1] = {
        ...previous,
        endLine: comment.endLine,
        text: `${previous.text}\n${comment.text}`,
      };
    } else grouped.push(comment);
  }
  return grouped;
}
