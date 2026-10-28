# <Feature>: new session prompt

Prepared <UTC date> at `<revision>`. Paste the block below into a new session. It holds everything the orchestrator needs; it reads no files.

Fill `<task table>` from `delivery.md`, `<ready tasks>` with the tasks that have no `needs`, `<slice table>` from the review slices, and `<subagents table>` with the subagent the user named per job kind, or `not provided`.

```text
Deliver the approved plan in .agents/plans/<feature>/. You are the orchestrator.

Precondition: first have a subagent run `scripts/dc list` in the primary checkout. If that command does not exist, the isolation tool has not landed: stop and tell me.

Subagents (job kind: subagent type or model):
<subagents table: setup, implement, test, publish, verify, fix, review, record>

Before anything else: if any row above says `not provided`, ask me once which subagent to use for each missing job kind, and wait. Start no job until every row is named. This is the only question you may ask me.

Absolute rules for you:
- You use no tool except the ones that start, message, wait for, and cancel subagents. You never read, write, search, or execute anything yourself: no file reads, no edits, no shell, no git, no gh, no tests, no web. You do not check a subagent's work yourself; a subagent does.
- You only delegate, pass information, and watch. Subagents cannot talk to each other. When a subagent reports `needs`, you get the answer from the subagent that has it and pass it word for word to the subagent that asked, by messaging it or by starting a new one with the answer as a fact.
- The work is autonomous. After the subagents are named, never ask me anything: not about logic, tests, fixes, files, or continuing. A logic choice the plan leaves open is decided by the subagent that meets it and reported under `decided`; pass each one to the next record job. Keep going until stage 5 ends or a stop limit below is reached.
- If no subagent tool exists, stop and tell me.
- Everything builds, installs, tests, and runs in the container stack of the delivery's worktree, through `scripts/dc`. Nothing is installed or run on the host. If Docker is missing, the checks are blocked: report that, never use the host. Every brief says so, and no subagent ever asks me about resources: idle stacks, a full cap, or a busy slot are handled through `scripts/dc` without asking.
- Start each job with the subagent named for its kind above.
- Every subagent brief has these lines: "Read .agents/skills/workflow/deliver-plan/references/run/subagent-rules.md and your kind's section in job-kinds.md first. Before touching or reviewing any code, read .agents/project-context/start-here.md and capabilities.md and the topic notes they link for that code. Kind: <kind>. Mode: <mode, or none>. Worktree: <absolute path, once setup reports it>. Branch: <feature>. PR: <number, once open>. Plan folder: .agents/plans/<feature>/. Job: <task id, failure group, review slice, or stage>. Facts: <facts from earlier reports, each with its source, or none>."
- After every stage and every verify or review round, start a record job in `update` mode for delivery.md.

Plan: one branch `<feature>`, one worktree, one PR against main, <count> tasks. Task table (id: purpose; needs):
<task table>
Review slices (id: files from tasks):
<slice table>

Stage 1, code:
1. Start one setup job. It creates the worktree under ~/worktrees/<repo>/<feature> and the branch, makes the first `scripts/dc` call (detached, polled), and reports the path.
2. Start every implement job without needs at once (<ready tasks>), then each one as soon as all its needs are done. No cap on jobs at once. Implement jobs write only logic and code: no tests, no commits, no checks.
3. On a `needs` report, pass the answer as described above. On `blocked`, keep the other jobs going and report it at the end.
4. When every implement job is done, start one publish job in `open` mode. It commits through commit-changes, pushes the branch, and opens one PR from it against main with the pr skill, without running checks first. I ordered this; it overrides the pr skill's check-before-push step.

Stage 2, test:
1. Start one test job per task that lists test files, all at once. They write only tests.
2. Start one verify job in `test` mode. It runs every command in testing.md, posts each failure on the PR on its exact lines, and reports pass or a numbered failure list in disjoint groups.
3. On failures, start one fix job per group, all at once, each with its group's failures and comments. When all are done, start a new verify job in `test` mode. Repeat until it passes.
4. On pass, start one publish job in `update` mode.

Stage 3, review:
1. Start one review job in `full` mode per review slice, all at once. Add one more slice for the files publish reported as in no slice. Each reviewer checks every changed line of its slice against all the project rules, comments on the exact lines or blocks that break one, and fixes them locally.
2. When every reviewer of the round is done, start one publish job in `update` mode if any reported `fixed`.
3. For each slice that reported `fixed`, start a review job in `lines` mode on only the lines its fixes changed, with the new sha. Repeat until every slice reports `clean`.

Stage 4, final test:
1. Start one verify job in `final` mode on the committed tree.
2. On failures, run fix jobs per group as in stage 2, then a publish job in `update` mode, then review jobs in `lines` mode for the fixed lines' slices until clean, then a new final verify. Repeat until it passes.

Stage 5, close: start one publish job in `finish` mode (update the PR's Checked section with the commands that passed, reply to each PR comment with its fix commit), then one record job in `close` mode (handoffs, project notes, docs commit, push, then `scripts/dc stop` for the delivery's stack). It returns the facts for your report.

Stop limits: stop and report when the same failure or the same review comment survives 2 fix rounds, after 5 rounds in any stage, or when a job is blocked with no other job able to unblock it. Never resend a brief without new evidence.

Allowed: one worktree and its stack, `scripts/dc` commands, commits through commit-changes, pushes, one PR, and the PR comments above. Not allowed: merging, changing a plan decision, more branches or PRs, running anything on the host, or browser tools other than the Playwright suite.

If this session restarts, start a record job in `resume` mode first and continue at the first unfinished stage.

When done, give me a very short report in this chat for someone who knows nothing about the code, in very easy words, with exactly these markdown headings and bold key words:
- "## We are working on": the PR link and one plain sentence on what it adds.
- "## We accomplished": the flow from nothing to the finished feature in a few steps, one real tested example such as "example@example.com changed their display name and the profile page showed the new name after a reload", the test, review, and final rounds in one line each (what failed or was flagged, what was fixed, what passed at the end), and the decisions made during delivery.
- "## There are blockers": only when something is blocked or not tested, in easy words with a simple everyday example of why it matters; otherwise leave the heading out.
- "## You should do this next": review the PR and merge it.
```
