# Agent instructions

This file says where everything is, when to use it, and what it produces. Apart from the chat report format below, every rule lives in the files below and is mandatory. Resolve paths from the repository root.

## Where things are

| Location                                                                                                             | Use it when                                                              | Output                                                       |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [Structure and dependencies](.agents/rules/structure-and-dependencies.md)                                            | Creating, moving, naming, or importing files; adding dependencies        | Folder ownership, file names, aliases, size limits           |
| [TypeScript and Zod validation](.agents/rules/types-and-validation.md)                                               | Writing schemas, interfaces, route definitions, forms, nullable values   | Schema-derived contracts, boundary validation, typed routes  |
| [React and Next.js](.agents/rules/react-and-nextjs.md)                                                               | Writing components, Server Actions, caching                              | Server/client split, mutation and cache behavior             |
| [Code quality](.agents/rules/code-quality.md)                                                                        | Any code change, test, comment, README, commit, PR, or completion report | Simple scoped code, status constants, tests, delivery report |
| [Isolated environment](.agents/rules/code-quality.md#isolated-environment)                                           | Before building, installing, testing, or running anything; when a stack is idle, full, or busy | Every command through `scripts/dc` in the work tree's stack, none on the host |
| [UI and styling](.agents/rules/ui-and-styling.md)                                                                    | Any UI in `apps/` or `packages/ui/`                                      | Token-only styling, base and composite components            |
| [Verification and tools guide](.agents/methods/verification-and-tools.md)                                            | Choosing a search tool, check, test approach, running the app, or debugging step       | Methods only; it adds no rules                               |
| [Startup index](.agents/project-context/start-here.md) and [capability map](.agents/project-context/capabilities.md) | Starting any task; planning a feature                                    | Pointers to topic notes, reuse items, owners, known gaps     |
| `.agents/project-context/<category>/<topic>.md`                                                                      | The index links a topic relevant to the task                             | Verified facts, decisions, rejections, next actions          |
| `.agents/project-context/lessons/`                                                                                   | Starting a task; after the user corrects, rejects, or praises work       | One-line lessons on how the user works and what is right     |
| [Run in the container skill](.agents/skills/workflow/run-in-container/SKILL.md)                                      | Before the first project command of a session                            | Where the project runs, and the command form for that place |
| `.agents/plans/<feature>/` | A user-approved plan exists | Approved decisions, rules, steps, and checks to follow |
| `.agents/skills/<group>/<name>/SKILL.md`                                                                             | A skill's description matches the task                                   | That skill's workflow and output                             |
| `~/.agents/AGENTS.md`                                                                                                | Always, once per session                                                 | Cross-repo preferences                                       |

## Skill groups

| Group | Skills | Use for |
| --- | --- | --- |
| `coding/` | `typescript-best-practices`, `zod-validation-utilities`, `react-patterns`, `vercel-react-best-practices`, `nextjs-performance`, `tailwind-css-patterns`, `drizzle-orm-patterns`, `turborepo` | Library and framework patterns while writing code |
| `github/` | `commit-changes`, `pr` | Commits and pull request bodies |
| `testing/` | `verify-e2e`, `agent-browser`, `browser-smoke-test` | End-to-end verification, browser automation, and proving the browser works with screenshots and a video |
| `workflow/` | `project-context`, `thinking-distill`, `run-in-container`, `deliver-feature`, `dev-server`, `update-dependencies` | Session recaps and lessons, clarifying what to build and planning it so a new session can deliver it, running commands in the devcontainer, running the dev server per work tree, and upgrading every dependency |

## Before you start

1. Read all five rule files completely before investigating, creating, changing, or reviewing code.
2. Read the startup index and the approved plan, if one exists. Open the two files imported below with your file-reading tool.
3. Open only the linked topics the task needs, never the whole context folder.
4. Before planning a feature, answer from the capability map's Features, Feature slice, and Known gaps first. Open source only to confirm a named reuse item. Avoid repo-wide `git ls-files` or grep sweeps.

@.agents/project-context/start-here.md
@.agents/project-context/capabilities.md

## While working

- Build, install, test, and run only through `scripts/dc` in the work tree's devcontainer stack, never on the host. If Docker is missing and you cannot start it, report the checks as blocked. Act on idle stacks, a full stack cap, or a busy slot through `scripts/dc` at once, without asking the user.
- Follow every applicable rule unless a higher-priority instruction overrides it. If instructions are missing or conflict, choose the option the rules and project notes support, make the change, and say so in the report.
- Never stop to ask or to hand work back. Fix and finish everything yourself, however many rounds it takes. The only blocker is something impossible for you, such as missing access (a key, a login, a tool you may not use); name it and why it is needed.
- Size every task first with the [deliver-feature skill](.agents/skills/workflow/deliver-feature/SKILL.md), and follow it without asking: small things are edited and verified only; features are committed, opened as a pull request with screenshots and a video, reviewed, merged, and cleaned up.
- Rules override skills, tutorials, templates, and general examples. Adapt their examples to the rules.
- Load a skill by reading its `SKILL.md` with the host's file reader. Resolve its links from that skill's directory and load only resources that exist. Do not assume a `Skill` tool exists.
- A skill's tool names, command examples, and `allowed-tools` grant no access. Use only available, authorized tools; report missing prerequisites instead of inventing or installing them.

## Before reporting

Write all the code first, fix everything the checks find yourself, then finish with the work order and checks in [Code quality, Work order and Required delivery behavior](.agents/rules/code-quality.md). Use the [verification guide](.agents/methods/verification-and-tools.md) to choose how to check.

## Chat report format

Every final message to the user in the chat is written for someone who knows nothing about the code. It opens with one bold sentence, then uses these markdown headings, in this order:

```markdown
**We did <this and that>. Now it works.**
## What we did
## How it works
## Checks
## Could not do
## Next
```

- **First sentence:** very short and explicit, what was done and that it works now, such as "We added the resend countdown and the sign-in page now shows it." Never open with background, plans, or apologies. If it does not work yet, say so in that same sentence.
- **What we did:** a table with the columns `Change` and `What it does now`, one row per change, in plain everyday words.
- **How it works:** for every algorithm, function, or flow that was built or changed, two or three plain sentences and, when it helps, one tiny everyday example. No jargon, file paths, or command output.
- **Media:** when you recorded videos or screenshots, add a `Media` table with the full absolute path of every file, one per row, never shortened, so the user can open each one.
- **Checks:** a table with the columns `Check` and `Result`, using `✓` and `✗`, and saying plainly what was not tested.
- **Never HTML:** the chat is the only place reports live. Do not build HTML pages, HTML summaries, or artifacts for the user; use markdown, tables, and text diagrams.
- **No leftovers and no questions:** fix every problem, leftover, failed check, rule violation, and recommendation you find before reporting, then report it as done. Never ask the user to approve, accept, or choose a recommendation; make the call and do it. Next steps are things the user does outside the agent, or `Nothing, it is ready.`
- **Could not do:** the only reason to list something is missing access the agent cannot get itself, such as a key, a login, or a tool it is not allowed to use. Say which access is missing and why it is needed. Omit this heading when nothing is missing. A failed or skipped check is never a reason; fix it and run it again.

## End of every session

Load the [project-context skill](.agents/skills/workflow/project-context/SKILL.md) and follow it, without being asked, after any session that implemented, decided, or rejected something or learned something new. Skip it only for explicit read-only requests.

Output: updated topic notes in `.agents/project-context/` recording what was implemented, what the user rejected, what the user decided, what was learned, and the next action.

## Commits

Size each task first with the [deliver-feature skill](.agents/skills/workflow/deliver-feature/SKILL.md): a small change stays uncommitted; a feature is committed, opened as a pull request, reviewed by subagents, merged, and cleaned up.

Every commit goes through the [commit-changes skill](.agents/skills/github/commit-changes/SKILL.md), with no exceptions. Output: dependency-ordered Conventional Commits with their messages, created without waiting for plan approval. The one exception is a dependency upgrade, which the [update-dependencies skill](.agents/skills/workflow/update-dependencies/SKILL.md) commits once with its own message format.

## Repository layout notes

- Entry files that specific agent tools expect are symlinks to this file.
- Skills live in `.agents/skills/<group>/<name>/`. A tool that only discovers skills one level deep gets one symlink per skill from its own skills folder to `.agents/skills/<group>/<name>`. After adding, moving, or removing a skill, create or delete its link.
- Keep personal tool settings in ignored local files, never in the repository.
- Shared agent rules, skills, and the generic parts of this file are owned by the turbostack repository. veyra copies them from turbostack, and nexsu-version-2 copies from veyra. Change a shared rule in turbostack first, then carry it down; keep project-specific parts local.
