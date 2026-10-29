# Lessons: delivery

Evidence: the user's words on 2026-10-29 (`main` at `dae4c74`) and plan deliveries run with the same workflow before this template took it over. Format and limits: [proof and lessons](../../skills/workflow/thinking-distill/references/learn/proof-and-lessons.md).

- 2026-10-29 · When a delivery runs, ask the user nothing until it ends; only an action a real person must do blocks, because the user wants deliveries without human intervention. Proof: 5 (user).
- 2026-10-24 · When many jobs run at once, cap the agents at once, because provider outages appeared when many jobs ran together. Proof: 4 (observed).
- 2026-10-25 · Read every plan path from the delivery worktree, because a verify job once read a stale `testing.md` from the main checkout. Proof: 4 (observed).
- 2026-10-25 · Before close, check every recorded sha with `git cat-file -t`, because a delivery record once cited a sha that did not exist. Proof: 4 (observed).
- 2026-10-26 · Give subagents absolute paths and run commands from the worktree, because task workers start in the session directory. Proof: 4 (observed).
- 2026-10-28 · Before review, put every changed file in a slice, because changed files outside any slice appeared in two deliveries. Proof: 4 (observed).
- 2026-10-24 · Count the PR body's words before opening it, because a PR body once went over the `pr` skill's limit. Proof: 4 (observed).
