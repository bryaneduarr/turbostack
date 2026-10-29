# Board: <feature>

Vision: <goal sentence>. Delivery worktree: `<absolute path once setup reports it>`. PR: `<URL once the draft is open>`. Agents at once: <N>, because <reason>. Chat: [chat](chat.md).

Jobs never edit this file. Each job appends one status line to [board log](board-log.md) ([how](../../skills/workflow/thinking-distill/references/run/team-chat.md#board-status-lines)); record jobs fold the log into these tables at each stage end.

## Tasks

Status values: `pending`, `writing`, `done`, `merged`, `blocked`.

| Task | Purpose | Wave | Worktree | Needs | Slice | Status |
| --- | --- | --- | --- | --- | --- | --- |
| t01 | <contracts> | 1 | own | none | r01 | pending |
| t02 | <migration> | 2 | delivery | t01 | r01 | pending |

## Reviews

Status values: `pending`, `reviewing`, `clean`, `findings`, `fixed`.

| Reviewer | Covers | Status | Must-fix | Should-fix |
| --- | --- | --- | --- | --- |
| r01 | rules: files of t01, t02 | pending | 0 | 0 |
| plan | the whole change | pending | 0 | 0 |
| reliability | the whole change | pending | 0 | 0 |
| security | the whole change | pending | 0 | 0 |

## Stages

Status values: `pending`, `running`, `done`, `blocked`.

| Stage | Status | Evidence |
| --- | --- | --- |
| setup | pending | <worktree paths> |
| code | pending | <tasks done> |
| merge | pending | <tasks merged, files formatted> |
| draft PR | pending | <PR URL, commits> |
| review | pending | <findings per reviewer> |
| fix | pending | <commits, comments resolved> |
| verify | pending | <run number, mode, and failing step of each failed run> |
| ready | pending | <passing run, PR ready> |
| close | pending | <outcomes, lessons, stack stopped> |

## Open chat posts

| Post | Type | For | About |
| --- | --- | --- | --- |

## Decisions made during delivery

| Decision | By job | Reason |
| --- | --- | --- |
