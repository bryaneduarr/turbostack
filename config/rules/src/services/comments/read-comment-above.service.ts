import type { CommentAbove } from "@workspace/rules/types/comments/comment-above.interface";

export function readCommentAbove(
  lines: readonly string[],
  lineIndex: number,
): CommentAbove {
  let index = lineIndex - 1;
  while (index >= 0 && lines[index]?.trim() === "") index -= 1;
  const previous = lines[index]?.trim();
  if (previous === undefined) return "none";
  if (previous.startsWith("//")) return "line";
  if (!previous.endsWith("*/")) return "none";

  while (index >= 0) {
    const line = lines[index]?.trim() ?? "";
    if (line.startsWith("/**")) return "documentation-block";
    if (line.startsWith("/*")) return "block";
    index -= 1;
  }
  return "none";
}
