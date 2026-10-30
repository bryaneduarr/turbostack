# Questions template

`questions.md` sits beside `plan.md`. Each question is answered `yes` or `no` with evidence: a command and its result, `path:line`, or a PR link. The delivery session answers them after the last passing `verify` run. Not run counts as `no` unless Allowed skips lists it. Drop questions that do not apply.

```markdown
# <feature> questions

1. Does `git diff origin/main...HEAD -- . ':!.agents'` cover every plan step and nothing else?
2. "<exact Done when line>": which browser scenario proves it, and did it pass in verify?
3. <Repeat question 2 for each Done when line.>
4. Which browser scenario covers each new behavior, and does it assert the parsed contract?
5. Did `scripts/dc bun run verify` pass from the work tree, or `scripts/dc bun run verify --failed` after the last fix?
6. Is the PR open against `main` with commit-changes commits, labels, and the author assigned?
7. Did every project command run through `scripts/dc` with nothing on the host, and was the stack stopped at close?

Allowed skips: Firefox and WebKit.
```
