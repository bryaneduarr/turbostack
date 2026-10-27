/** Describes one runtime import of a workspace package found in a file. */
export interface WorkspaceImport {
  /** Names the imported workspace package, such as `@workspace/database`. */
  packageName: string;
  /** Gives the 1-based line where the import statement starts. */
  line: number;
}
