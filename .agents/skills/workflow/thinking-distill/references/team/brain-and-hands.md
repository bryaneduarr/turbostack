# Brain and hands

The brain directs; the hands do. The brain (Opus 5.5) is the most expensive model in the 5-hour usage window, so it only says what to do: it finds the goal, asks the user, decides, and writes short directions and specs. The hands (Haiku 5.5) do everything else: read, survey, write every file, run every command, route the delivery, and review. The brain never writes a long file, and the hands never make a decision the brain should make.

## Who does what

| Work | Who | Reasoning | Output |
| --- | --- | --- | --- |
| Planning session: understand, critique, ask, summary, split, task specs | brain | high | `thinking.md` bullets, questions and summary in chat, the spec blocks in `board.md` |
| Scouts: planning reads and the survey | hands | medium | facts with `path:line`, at most 300 words |
| Critic | brain | medium | failures and fixes as directions, at most 300 words |
| Writers: `plan.md`, `summary.html`, every delivery file; the checker | hands | low | files filled from the brain's decisions and specs |
| Delivery orchestrator | hands | medium | briefs and routing, by the prompt |
| `advise` | brain | medium | directions only, at most 150 words; edits nothing |
| `review` in `security` mode | brain | medium | PR comments that say what to fix |
| `setup`, `publish`, `verify`, `record` | hands | low | as the job file says |
| `implement`, `fix`, `review` in `rules`, `plan`, and `reliability` mode | hands | medium | as the job file says |

Name the models as the harness lists them; the user may name others in the team round, and the roles stay the same.

## When the brain is called during delivery

Only through an [advise](../run/jobs/advise.md) job, when:

- A hands job reports `needs` on a choice the plan, the rules, and the project context do not answer.
- A hands job fails twice on the same brief.
- The same failure survives 3 fix rounds (the stop limit).

The advisor reads the evidence and returns what to do. The orchestrator starts a new hands job with those directions as Facts.

## Hands get briefs with nothing left to decide

- A brief names the files, the file to mirror, the helpers to import instead of copying, the exports on both sides of every Agreed interface, and the rules that bite there. The thinking lives in the brief, so the hands need little reasoning.
- A task marked `Risk: high` (permission checks, access queries, migrations that move data, concurrency and locks, money) gets its logic from the brain step by step in the spec, and the security auditor reads its files first.
- Never run hands on high reasoning. In a measured 22-task delivery (2026-10-29), Haiku 5.5 on high spent 78% of its review output on reasoning, averaged 50k output tokens per reviewer, and its 4 implement jobs used as many output tokens (302k) as 17 Opus implement jobs (309k).

## Fitting the 5-hour window

A measured 22-task delivery (2026-10-29) used 80 jobs, 2.46M output tokens, and 140M cached input tokens in about 3 hours 20 minutes. Most of the cached input came from turns: every tool call resends the job's whole context.

- About 30 jobs per delivery: one implement job per task (8 to 12 tasks), setup, 3 publish, at most 4 rules reviewers and 3 auditors, at most 4 fix jobs, 2 verify, 1 record. Brain jobs: the security auditor and any advise.
- Fewer turns per job: read every file you need in one call, chain shell commands, and stop when the Done when lines are met.
- One delivery should fit in about one hour, so two or three fit in one window.
