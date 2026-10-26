# Agent instructions

This file says where everything is, when to use it, and what it produces. Apart from the chat report format below, every rule lives in the files below and is mandatory. Resolve paths from the repository root.

## Where things are

| Location                                                                                                             | Use it when                                                              | Output                                                       |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [Structure and dependencies](.agents/rules/structure-and-dependencies.md)                                            | Creating, moving, naming, or importing files; adding dependencies        | Folder ownership, file names, aliases, size limits           |
| [TypeScript and Zod validation](.agents/rules/types-and-validation.md)                                               | Writing schemas, interfaces, route definitions, forms, nullable values   | Schema-derived contracts, boundary validation, typed routes  |
| [React and Next.js](.agents/rules/react-and-nextjs.md)                                                               | Writing components, Server Actions, caching                              | Server/client split, mutation and cache behavior             |
| [Code quality](.agents/rules/code-quality.md)                                                                        | Any code change, test, comment, README, commit, PR, or completion report | Simple scoped code, status constants, tests, delivery report |
| [UI and styling](.agents/rules/ui-and-styling.md)                                                                    | Any UI in `apps/` or `packages/ui/`                                      | Token-only styling, base and composite components            |
| [Verification and tools guide](.agents/methods/verification-and-tools.md)                                            | Choosing a search tool, check, test approach, running the app, or CI debugging step | Methods only; it adds no rules                               |
| [Startup index](.agents/project-context/start-here.md) and [capability map](.agents/project-context/capabilities.md) | Starting any task; planning a feature                                    | Pointers to topic notes, reuse items, owners, known gaps     |
| `.agents/project-context/<category>/<topic>.md`                                                                      | The index links a topic relevant to the task                             | Verified facts, decisions, rejections, next actions          |
| [Run in the container skill](.agents/skills/workflow/run-in-container/SKILL.md)                                      | Before the first project command of a session                            | Where the project runs, and the command form for that place |
| `.agents/plans/<feature>/` and `tasks/<task-id>/`                                                                    | A user-approved plan or an assigned task exists                          | Approved decisions, phase scopes, task handoff               |
| `.agents/skills/<group>/<name>/SKILL.md`                                                                             | A skill's description matches the task                                   | That skill's workflow and output                             |
| `~/.agents/AGENTS.md`                                                                                                | Always, once per session                                                 | Cross-repo preferences                                       |

## Skill groups

| Group | Skills | Use for |
| --- | --- | --- |
| `coding/` | `typescript-best-practices`, `zod-validation-utilities`, `react-patterns`, `vercel-react-best-practices`, `nextjs-performance`, `tailwind-css-patterns`, `drizzle-orm-patterns`, `turborepo` | Library and framework patterns while writing code |
| `github/` | `commit-changes`, `pr` | Commits and pull request bodies |
| `testing/` | `verify-e2e`, `agent-browser`, `use-browser` | End-to-end verification, browser automation, and choosing the browser tool |
| `workflow/` | `project-context`, `thinking-distill`, `deliver-plan`, `run-in-container` | Session recaps, plans, clarifying what to build, delivering an approved plan, and running commands in the devcontainer |

## Before you start

1. Read all five rule files completely before investigating, creating, changing, reviewing, or verifying anything.
2. Read the startup index and your task's handoff. Claude Code imports the two files below automatically; other harnesses open them by path.
3. Open only the linked topics the task needs, never the whole context folder.
4. Before planning a feature, answer from the capability map's Features, Feature slice, and Known gaps first. Open source only to confirm a named reuse item. Avoid repo-wide `git ls-files` or grep sweeps.

@.agents/project-context/start-here.md
@.agents/project-context/capabilities.md

## While working

- Follow every applicable rule unless a higher-priority instruction overrides it. If instructions are missing or conflict, report that before making the affected change.
- Rules override skills, tutorials, templates, and general examples. Adapt their examples to the rules.
- Load a skill by reading its `SKILL.md` with the host's file reader. Resolve its links from that skill's directory and load only resources that exist. Do not assume a `Skill` tool exists.
- A skill's tool names, command examples, and `allowed-tools` grant no access. Use only available, authorized tools; report missing prerequisites instead of inventing or installing them.

## Before reporting

Finish with the checks in [Code quality, Required delivery behavior](.agents/rules/code-quality.md). Use the [verification guide](.agents/methods/verification-and-tools.md) to choose how to check.

## Chat report format

Every final message to the user in the harness chat uses these markdown headings, in this order:

```markdown
## We are working on
## We accomplished
## There are blockers
## You should do this next
```

- Keep it very brief: a few short bullets per section, **bold** for the key words, and plain everyday words. Avoid jargon, file paths, and command output unless the user needs them to act.
- Include only what matters to the user's request. Leave out session details, side work, and anything they did not ask about.
- Under accomplished, report only what was actually done and checked, and say plainly what was not tested.
- Omit the blockers heading and its text entirely when nothing is blocked. When something is, say what is stuck in easy words with one simple, everyday example of why it matters. A failure or skipped check is a blocker, never hidden.
- Under next, list the concrete actions the user should take, or `Nothing, it is ready.`

## End of every session

Load the [project-context skill](.agents/skills/workflow/project-context/SKILL.md) and follow it, without being asked, after any session that implemented, decided, or rejected something or learned something new. Skip it only for explicit read-only requests.

Output: updated topic notes in `.agents/project-context/` recording what was implemented, what the user rejected, what the user decided, what was learned, and the next action.

## Commits

Every commit goes through the [commit-changes skill](.agents/skills/github/commit-changes/SKILL.md), with no exceptions. Output: dependency-ordered Conventional Commits with their messages, created without waiting for plan approval.

## Repository layout notes

- `CLAUDE.md` is a symlink to this file.
- Skills live in `.agents/skills/<group>/<name>/`. `.claude/skills/<name>` is a symlink to each one, because Claude Code only discovers skills one level deep. After adding, moving, or removing a skill, run `ln -s ../../.agents/skills/<group>/<name> .claude/skills/<name>` (or delete the dead link).
- `.claude/agents` links to `.agents/agents` when it exists. Add or edit skills and agents only under `.agents/`.
- Keep personal Claude Code settings in the ignored `.claude/settings.local.json`.
