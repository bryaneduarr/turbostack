# Guide to verification and tools

Use this guide to choose a useful approach for the current task. It is a decision aid, not a mandatory checklist. Relevant scenarios can be combined; unrelated checks can be left out. Permissions come from the task and applicable instructions, not from reading this guide.

## Choose the tool for the question

| Situation                                                     | Useful starting point                                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| The relevant file is not known.                               | Search filenames within the likely application or package.                       |
| A literal, import, or configuration setting needs locating.   | Use a scoped text search, then read the matching source.                         |
| A symbol's type, definition, or consumers need understanding. | Use read-only LSP tools when available; otherwise search and inspect references. |
| The shape of code matters more than its spelling.             | Use structural search and inspect the surrounding code.                          |
| The file or function is already known.                        | Read a bounded slice or the specific symbol.                                     |
| A known implementation needs changing.                        | Use precise edits after reading its current contents.                            |
| Git state or a package command needs inspecting.              | Use shell commands for these operations.                                         |
| Independent investigation can be delegated.                   | Give a subagent one bounded question and only the context it needs.              |
| The user asks for online research.                            | Use the web-research skill and source-linked web tools.                          |

## When investigating without changing code

Start with the reported behavior, find the relevant definitions, and trace their consumers. Compare documentation with implementation where they disagree. A missing search result can warrant a narrower query or a Git status check, especially for hidden, ignored, or deleted files.

The useful outcome is an evidence-based explanation with file references and clearly stated uncertainties. Code edits, test execution, and browser interaction are separate activities, not automatic parts of an investigation.

## When changing documentation or instructions

Review the edited text for consistency, check that links point to existing files, and look for references to intentionally deleted documents. This usually calls for documentation checks rather than TypeScript compilation.

```sh
git diff --check -- path/to/document.md
```

For newly created files, ordinary `git diff` may not show their contents; reading them directly helps complete the review.

## When changing TypeScript code

Locate the owning package's scripts and choose its existing type-check command. If a change affects another package's imports or contracts, checking that consumer can reveal errors the owning package alone would miss.

For example, when both the schemas package and server are affected and these scripts remain available:

```sh
bun run --cwd packages/schemas check-types
bun run --cwd apps/server check-types
```

Linting can help with relevant static issues when the package provides a suitable script. A passing type check establishes compilation, not runtime behavior.

## When fixing or refactoring behavior

Inspect scoped Git status before editing to distinguish existing user changes from the task. Trace the affected execution flow, make the focused change, and compare the result with the original behavior and intended outcome.

Reviewing the scoped diff, direct consumers, and affected package checks is usually more useful than running every workspace command. Builds can add confidence when bundling, package exports, or framework integration are part of the change.

## When the user requests tests

Choose the smallest test scope that addresses the requested behavior. Vitest fits focused unit and integration checks; browser flows fit browser-testing tools. Existing package scripts and nearby tests can help identify the intended command and setup.

Report which checks actually ran and what they established. A generic request to investigate or verify can be handled through source inspection and static checks; test permission is defined separately in `AGENTS.md`.

## When browser interaction is requested

After identifying the requested tool and checking that it is available, try the localhost connection for up to 10 seconds.

For explicitly requested `agent-browser` work:

```sh
timeout 10s agent-browser connect "http://localhost:9222"
```

For requested Chrome DevTools work, the CLI connection is:

```sh
timeout 10s chrome-devtools start --browserUrl http://localhost:9222
```

If localhost is unavailable, obtain the default gateway:

```sh
GATEWAY_IP="$(ip route show | grep default | awk '{print $3}')"
```

If a gateway is available, retry the same tool against it:

```sh
timeout 10s agent-browser connect "http://${GATEWAY_IP}:9222"
# For Chrome DevTools work, retry with the same CLI.
timeout 10s chrome-devtools start --browserUrl "http://${GATEWAY_IP}:9222"
```

After a successful connection, `agent-browser snapshot -i` or `chrome-devtools list_pages` provides the starting browser context. If neither connection succeeds, report the connection problem rather than attempting browser actions without a session.

## When verification is blocked

Identify whether the obstacle is a missing dependency, unavailable tool, environment setting, connection problem, or existing code error. Explain which check was blocked and what could still be inspected without it.

A concise delivery summary can state what changed, which checks passed or failed, and what remains unverified. This keeps source-review conclusions separate from compile-time and runtime evidence.
