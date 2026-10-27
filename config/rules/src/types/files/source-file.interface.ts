/** Represents one tracked repository file loaded for rule checks. */
export interface SourceFile {
  /** Locates the file relative to the repository root, using forward slashes. */
  path: string;
  /** Contains the complete file contents. */
  text: string;
  /** Splits the contents into lines; index zero is line one. */
  lines: readonly string[];
}
