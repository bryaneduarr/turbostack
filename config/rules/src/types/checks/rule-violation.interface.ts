/** Describes one place where a file breaks a project rule. */
export interface RuleViolation {
  /** Names the broken rule, matching the check that reported it. */
  ruleId: string;
  /** Locates the offending file relative to the repository root. */
  path: string;
  /** Points to the offending line; file-wide problems use line one. */
  line: number;
  /** Explains the problem and the expected fix. */
  message: string;
}
