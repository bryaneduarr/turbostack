# <Feature>: new session prompt

Prepared <UTC date> at `<revision>`. Paste the block below into a new session started in the primary checkout. It holds everything the session needs to start; the plan folder holds the rest.

Fill `<vision>` from the plan's goal, `<feature>` with the slug, `<count>` from `steps.md`, and every path with its absolute value.

```text
Deliver the approved plan in .agents/plans/<feature>/.

Vision: <vision: the goal sentence and why it matters, in two sentences>.

Read first, in order: AGENTS.md and the five rule files it names, then .agents/plans/<feature>/README.md and the files it lists. The plan's choices are decided; change none of them. The rules in .agents/rules/ and the choices in plan.md are the rules of this delivery.

No human help. From now until the close stage ends, do not ask me anything, not about logic, scenarios, fixes, files, or continuing. The only blocker is an action only a real person can do: signing in to a website, approving an authentication prompt, giving a secret only I have, paying, or installing Docker. Anything else that fails is work: change the approach, find the cause, log it, and keep going. When a real-person action is needed, keep every other step going and give me the action, with exact steps, in the final report.

Precondition: run `scripts/dc list` in the primary checkout. If that command does not exist, stop and tell me.

Plan: one branch <feature>, one PR against main, <count> steps in steps.md.

Stage 1, setup: create the branch <feature> in the primary checkout, then make the first `scripts/dc` call there. It builds the stack and can take minutes: run it detached and poll.

Stage 2, code: build the steps in steps.md in order. For each step, read the files it names, write only what its Brief says, and when its files are complete run Biome and the type check on them once and fix your own errors. Write code and browser scenarios only: no unit tests, no browser runs, no commits yet. Note every choice the plan left open under `decided`.

Stage 3, verify: run `scripts/dc bun run verify`. On failures, find the cause, fix it, and run `scripts/dc bun run verify --failed` until it passes. Answer every line of questions.md with real evidence from the last passing run.

Stage 4, pull request: commit through commit-changes, push, and open the PR against main with the pr skill. Put the passing run and the `decided` lines in the PR body.

Stage 5, close: fill outcomes.md, write the lessons and project notes through the project-context skill, commit and push the docs, and stop the stack with `scripts/dc stop`.

Stop limits: when the same failure survives 3 fix rounds, stop patching, gather new evidence, and try a different approach. After 8 rounds in any stage, stop that stage, record it as a failure in outcomes.md, and report.

Allowed: the work tree and its stack, `scripts/dc` commands, commits through commit-changes, pushes, one PR. Not allowed: merging the PR, changing a plan choice, more branches or PRs, running anything on the host, or browser tools other than the Playwright suite.

If this session restarts, read README.md Status and continue at the first unfinished step.

When done, give me a very short report in this chat for someone who knows nothing about the code, in very easy words, with exactly these markdown headings and bold key words:
- "## We are working on": the PR link and one plain sentence on what it adds.
- "## We accomplished": the flow from nothing to the finished feature in a few steps; one real tested example; the verify rounds (what failed, what was fixed, what passed at the end); the decisions made during delivery; the scorecard in one line; and "What you learned": how the main ideas were really built and what failed and why.
- "## There are blockers": only a real-person action or something not tested, in easy words with a simple everyday example of why it matters, and the exact steps for me; otherwise leave the heading out.
- "## You should do this next": review the PR and merge it, and answer the success/failure checks from outcomes.md.
```
