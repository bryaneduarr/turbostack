# Steps

## One branch, one PR

The whole feature lives on branch `<feature>` and opens one PR against `main`. No phases, stacked PRs, or integration branches.

## Survey

Before writing the steps, read the code for every plan step that touches existing code. Note, for each: the files the step edits, the file to mirror, the helpers, components, class maps, and constants to import instead of copying, the shared files (routers, catalogs, grants, migrations, `bun.lock`), folders near 10 files, and files near 200 lines. Keep the result in `thinking.md` under Where to look.

## Steps

- **One piece each:** one focused purpose, at most 8 code files. Id `s<nn>`, in the order they are built. A step places a brick, never the house. Prefer fewer, larger focused steps; aim at 8 to 12 steps, and when the plan needs more than 14, split it into deliveries.
- **A clear brief:** every step fills Vision, Piece, Done when, Not this step, Inputs, and If unclear, so a session reading only `steps.md` and the files it names can finish without asking.
- **Code first:** steps write logic, constants, schemas, route definitions, components, generated migrations, and the browser scenario their behavior needs (`apps/client/src/e2e/**/*.e2e.ts`). No unit test files.
- **One owner per file:** no two steps edit the same file. One step owns each shared file (routers, catalogs, grants, migrations, `bun.lock`).
- **Order:** a step comes after another only when it must read or run that step's output, such as `drizzle:generate` needing the table file. Importing a file another step creates is not a reason to wait when both steps name its path and exports under Agreed interfaces.
- **Scenarios:** a browser scenario goes in the step that completes its flow, or in its own step when no single step does. The plan fixes the words a person sees, the labels, routes, test ids, and seeded data under Agreed interfaces, so a scenario is written against them.
- **Generators:** one step runs `drizzle:generate`, after the table steps; one step changes `bun.lock`, the earliest that needs the package.

## Step specs

Every step spells out:

- **Reuse:** the helpers, components, class maps, and constants to import, from the survey. Copied helpers and types in the wrong folder are the most common review finding.
- **Rules that bite:** two to five rule sections this step is most likely to break, such as "types-and-validation: derive the window fields from the schema", so the reader knows where to look after reading the five rules.
- **Risk:** `high` where one wrong line leaks access or data, otherwise `normal`. A `high` step gives its logic one line at a time.
- **Per code file:** its exact behavior and the exports others use.
