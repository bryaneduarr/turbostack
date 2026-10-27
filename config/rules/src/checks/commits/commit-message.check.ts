import { describeCommitMessageProblems } from "@workspace/rules/services/commits/describe-commit-message-problems.service";
import { listBranchCommits } from "@workspace/rules/services/commits/list-branch-commits.service";
import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

const ruleId = "commit-message";

export const commitMessageCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ rootPath }) =>
    (await listBranchCommits(rootPath)).flatMap(({ hash, message }) =>
      describeCommitMessageProblems(message).map((problem) => ({
        ruleId,
        path: `commit ${hash}`,
        line: 1,
        message: problem,
      })),
    ),
};
