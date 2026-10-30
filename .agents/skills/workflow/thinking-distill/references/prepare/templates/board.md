# Board: <feature>

Vision: <goal sentence>. Delivery worktree: `<absolute path once setup reports it>`. PR: `<URL once the draft is open>`. Agents at once: <N>, because <reason>. Chat: [chat](chat.md).

Jobs never edit this file. Each job appends one status line to [board log](board-log.md) ([how](../../skills/workflow/thinking-distill/references/run/team-chat.md#board-status-lines)); the record job folds the log into these tables at close, or reads it on resume.

Longest needs chain: <task ids>, <count> tasks. Scheduling: <rolling or batches>, because <harness>.

## Tasks

Status values: `pending`, `writing`, `done`, `blocked`. Size: `S`, `M`, `L`. Risk: `normal` or `high`.

| Task | Purpose | Size | Risk | Wave | Worktree | Needs | Slice | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| t01 | <contracts> | S | normal | 1 | own | none | r01 | pending |
| t02 | <access query> | L | high | 2 | delivery | t01 | r01 | pending |

## Task specs

The brain's spec for each task; a hands writer turns each block into its `task.md` ([task specs](../../skills/workflow/thinking-distill/references/prepare/split-rules.md#task-specs)).

### t01

- Piece: <one line>.
- Files: <path → exact behavior and exports; for `high` risk, the logic step by step>.
- Mirror: <existing file and the shape to copy>.
- Reuse: <helpers, components, class maps, constants to import>.
- Interfaces: <uses or provides path → exports, with task ids>.
- Rules that bite: <rule file: section, two to five>.
- Done when: <checkable lines>.
- Scenario: <steps and assertions against the agreed words, or none>.

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
| code | pending | <tasks done and copied into the delivery worktree> |
| draft PR | pending | <files formatted, PR URL, commits> |
| review | pending | <findings per reviewer> |
| fix | pending | <commits, comments resolved> |
| verify | pending | <run number, mode, and failing step of each failed run> |
| ready | pending | <passing run, PR ready> |
| close | pending | <outcomes, lessons, stack stopped> |

## Open chat posts

Filled at close: every `ask` or `finding` without a `closes` post.

| Post | Type | For | About |
| --- | --- | --- | --- |

## Decisions made during delivery

| Decision | By job | Reason |
| --- | --- | --- |
