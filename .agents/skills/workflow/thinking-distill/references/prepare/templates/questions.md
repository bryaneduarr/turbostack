# Questions template

`questions.md` sits beside `plan.md`. Each question is answered `yes` or `no` with evidence: a command and its result, `path:line`, or a PR link. The verify job answers questions 1 to 6 and 9 after the last passing `verify` run; the record job in `close` mode answers 7, 8, and 10. Not run counts as `no` unless Allowed skips lists it. Drop questions that do not apply.

```markdown
# <feature> questions

1. Does `git diff origin/main...HEAD -- . ':!.agents'` cover every plan step and nothing else?
2. "<exact Done when line>": which browser scenario proves it, and did it pass in verify?
3. <Repeat question 2 for each Done when line.>
4. Which browser scenario covers each new behavior, and does it assert the parsed contract?
5. Did `scripts/dc bun run verify` pass in the delivery worktree, or `scripts/dc bun run verify --failed` after the last fix?
6. Did every rules reviewer and the plan, reliability, and security auditors finish, and is every must-fix comment answered with "Fixed in <commit>" and resolved?
7. Are the should-fix findings listed in the PR body?
8. Is the PR ready (not draft) against `main`, with commit-changes commits, labels, and the author assigned?
9. Does every chat post that needed an answer have a `closes` post?
10. Did every project command run through `scripts/dc` in the delivery worktree, with nothing on the host, were the task worktrees removed, and was the stack stopped at close?

Allowed skips: Firefox and WebKit.
```
