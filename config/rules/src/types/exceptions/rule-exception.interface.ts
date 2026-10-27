/** Records one deliberate, reviewed exemption from a rule. */
export interface RuleException {
  /** Names the rule being waived. */
  ruleId: string;
  /** Matches the exact repository-relative path the exemption covers. */
  path: string;
  /** States why the rule cannot or should not apply to this file. */
  reason: string;
}
