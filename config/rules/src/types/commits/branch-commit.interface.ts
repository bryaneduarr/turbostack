/** Describes one commit on the current branch that is not yet on main. */
export interface BranchCommit {
  /** Identifies the commit by its abbreviated hash. */
  hash: string;
  /** Contains the full commit message, title first. */
  message: string;
}
