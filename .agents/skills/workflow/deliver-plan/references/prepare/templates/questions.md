# Questions template

`questions.md` sits beside `plan.md`. The verify job answers each question `yes` or `no` with evidence after a passing `verify` run: a command and its result, or `path:line`. Not run counts as `no` unless Allowed skips lists it. Drop questions that do not apply.

```markdown
# <feature> questions

1. Does `git diff main...` cover every plan step and nothing else?
2. "<exact Done when line>": which browser scenario proves it, and did it pass in verify?
3. <Repeat question 2 for each Done when line.>
4. Which browser scenario covers each new behavior, and does it assert the parsed contract?
5. Did `scripts/dc bun run verify` pass on the work tree, or `scripts/dc bun run verify --failed` after the last fix?
6. Did every review slice report clean?
7. Is the PR open against `main` with commit-changes commits, labels, and the author assigned?
8. Did every project command run through `scripts/dc` in the delivery's worktree, with nothing installed or run on the host, and was the stack stopped at close?

Allowed skips: Firefox and WebKit.
```
