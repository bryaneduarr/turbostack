/** Represents one comment found in source code, outside strings and regular expressions. */
export interface SourceComment {
  /** Separates double-slash line comments from slash-star block comments. */
  kind: "line" | "block";
  /** Points to the line where the comment starts. */
  startLine: number;
  /** Points to the line where the comment ends. */
  endLine: number;
  /** Contains the comment text without its delimiters. */
  text: string;
}
