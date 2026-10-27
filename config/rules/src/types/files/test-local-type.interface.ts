/** Represents a type or interface declared inside a test file. */
export interface TestLocalType {
  /** Locates the declaring test file relative to the repository root. */
  path: string;
  /** Points to the line where the declaration starts. */
  line: number;
  /** Contains the declared type name. */
  name: string;
  /** Counts the lines the declaration spans. */
  lineCount: number;
}
