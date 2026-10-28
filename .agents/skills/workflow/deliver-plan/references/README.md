# deliver-plan references

| Path | Holds |
| --- | --- |
| `prepare/` | What the skill reads to cut the plan and write the delivery folder |
| `prepare/split-rules.md` | How to cut the plan into few focused parallel tasks with code files and browser scenarios, and into review slices, on one branch and one PR |
| `prepare/templates/` | One template per file the skill writes beside the plan |
| `prepare/templates/readme.md` | The plan folder's `README.md`: reading order |
| `prepare/templates/prompt.md` | `prompt.md`: the self-contained prompt for the autonomous, delegate-only orchestrator, with its Subagents table, stages, and rules |
| `prepare/templates/delivery.md` | `delivery.md`: task table with needs, review slices, stage table, status values, and decisions made during delivery |
| `prepare/templates/testing.md` | `testing.md`: the `verify` and `verify --failed` commands, e2e scenarios, and allowed skips |
| `prepare/templates/questions.md` | `questions.md`: acceptance questions the verify job answers |
| `prepare/templates/task.md` | `tasks/<task-id>/task.md`: scope, code files, browser scenario, agreed interfaces, and the brief |
| `run/` | What each subagent in the new session reads |
| `run/subagent-rules.md` | Rules every subagent follows: container-only work, resource etiquette, autonomous decisions, the `needs` relay, and the report format |
| `run/job-kinds.md` | One section per job kind: setup (worktree plus first `scripts/dc` call), implement, review, verify, fix, publish, record (close stops the stack) |
