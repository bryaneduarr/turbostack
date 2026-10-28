# Questions template

`questions.md` sits beside `plan.md`. The verify job in the final test stage answers each question `yes` or `no` with evidence: a command and its result, or `path:line`. Not run counts as `no` unless Allowed skips lists it. Drop questions that do not apply.

```markdown
# <feature> questions

1. Does `git diff main...` cover every plan step and nothing else?
2. "<exact Done when line>": which test or e2e step proves it, and did it pass there?
3. <Repeat question 2 for each Done when line.>
4. Which test covers each new behavior, and does it assert the parsed contract?
5. Do `check-types` and `test` pass in every affected package, and `scripts/dc bun run check:rules` and `scripts/dc bunx biome ci .` at the root?
6. Did `scripts/dc bun run check` and `scripts/dc bun run verify` pass on the committed tree?
7. Did every review slice report clean, and does every PR comment have a fix commit or a reason it needs none?
8. Is the PR open against `main` with commit-changes commits, labels, and the author assigned?
9. Did every project command run through `scripts/dc` in the delivery's worktree, with nothing installed or run on the host, and was the stack stopped at close?

Allowed skips: WebKit locally.
```
