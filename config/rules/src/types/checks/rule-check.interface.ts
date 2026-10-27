import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";
import type { SourceFile } from "@workspace/rules/types/files/source-file.interface";

/** Describes a rule that inspects each checked file on its own. */
export interface FileRuleCheck {
  /** Distinguishes this variant from repository-wide checks. */
  scope: "file";
  /** Names the rule in reports and exception entries. */
  ruleId: string;
  /** Selects the files this rule applies to. */
  appliesTo: (path: string) => boolean;
  /** Returns every violation found in one file. */
  check: (file: SourceFile) => RuleViolation[];
}

/** Describes a rule that needs the whole tracked file list at once. */
export interface RepositoryRuleCheck {
  /** Distinguishes this variant from per-file checks. */
  scope: "repository";
  /** Names the rule in reports and exception entries. */
  ruleId: string;
  /** Returns every violation found across the repository. */
  check: (input: RepositoryCheckInput) => Promise<RuleViolation[]>;
}

/** Carries what repository-wide checks read. */
export interface RepositoryCheckInput {
  /** Contains the absolute repository root path. */
  rootPath: string;
  /** Lists every tracked file path relative to the root. */
  trackedPaths: readonly string[];
}

/** Represents either kind of rule check. */
export type RuleCheck = FileRuleCheck | RepositoryRuleCheck;
