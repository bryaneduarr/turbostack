# Delivery: <feature>

Branch `<feature>` from `main`, one PR against `main`. Worktree: `<absolute path under ~/worktrees/<repo>/ once setup reports it>`, with its own container stack (`scripts/dc`), stopped at close. PR: `<URL once publish reports it>`. Only record jobs edit this file.

Task status values: `pending`, `ready`, `writing`, `done`, `blocked`.

## Tasks

| Task | Purpose | Needs | Code |
| --- | --- | --- | --- |
| t01 | <contracts> | none | pending |
| t02 | <database table> | none | pending |
| t03 | <migration> | t02 | pending |

Starts at once: <task ids without needs>.

## Review slices

Slice status values: `pending`, `reviewing`, `fixing`, `clean`, `blocked`.

| Slice | Files from | Status | Rounds |
| --- | --- | --- | --- |
| r01 | t01, t02 | pending | 0 |

## Stages

Stage status values: `pending`, `running`, `done`, `blocked`.

| Stage | Status | Evidence |
| --- | --- | --- |
| code | pending | <commits or changed files> |
| review | pending | <round number and fixed lines per slice> |
| verify | pending | <run number, mode, and the failing step of each failed run> |
| publish | pending | <PR URL and the passing verify run> |
| close | pending | |

## Decisions made during delivery

| Decision | By job | Reason |
| --- | --- | --- |
