# Team chat

The delivery team works like specialists around one shared board (the blackboard pattern): nobody calls anyone directly, everyone reads and writes one shared file, and a moderator, the orchestrator, wakes whoever a post needs. The chat is `chat.md` in the plan folder of the delivery worktree; every job uses that one absolute path, whichever worktree it works in.

```text
             chat.md (append-only; everyone reads, nobody edits old posts)
   ┌──────────────┬──────────────┼──────────────┬───────────────┐
 t01 code      t02 code      r01 rules      security audit   fix r02
   │  reads at: start, after each file, before reporting
   └── each report lists "posted: t01-2 ask @t02" ──► orchestrator
                                  wakes or starts whoever is mentioned
```

## Post types

| Type | Use it to | Example |
| --- | --- | --- |
| `announce` | Share a fact others build on | "`packages/schemas/src/.../revoke-sessions.schema.ts` exports `revokeSessionsSchema`" |
| `ask` | Ask a job for a fact | "@t02 which error code does the handler return when nothing was revoked?" |
| `answer` | Answer an ask or a finding; mention its author and add `closes <post id>` | "@t01 closes t01-2: `SESSION-004`, at `.../revoke.handler.ts:31`" |
| `finding` | Report a problem in another job's area | "@t04 `.../revoke.handler.ts:42` revokes before checking the permission (plan choice 3)" |
| `done` | Say your piece is finished and what it provides | "t02 done: route, handler, and scenario; nothing changed in the agreed interfaces" |

Every post names files with `path:line`, tasks by id, slices by id, plan steps or choices by number, and PR comments by URL when they exist. One post holds one point, in at most 80 words.

## Write

Job ids: `planner` (the planning session), `setup`, `t<nn>` (implement), `merge-t<nn>`, `merge-last`, `publish`, `r<nn>` (rules reviewer), `plan`, `reliability`, `security` (auditors), `fix-r<nn>` or `fix-g<n>` (failure group), `verify`, `record`. Post ids are `<job id>-<n>`, where `<n>` counts that id's posts so far: `t03-1`, `r02-4`, `security-2`, `fix-r01-1`. Append with one shell command, never with an editor, so concurrent posts are never lost:

```sh
chat="<plan folder>/chat.md"
n=$(( $(grep -c '^### t03-' "$chat") + 1 ))
cat >> "$chat" <<EOF

### t03-$n · finding · @t04 · $(date -u +%FT%TZ)

\`apps/server/src/.../revoke.handler.ts:42\`: sessions are revoked before the permission check (plan choice 3). Fix: check first.
EOF
```

Close a post with a later post that says `closes <post id>`. Never edit or delete a post, yours or anyone's.

## Read

At the start of your job, after each file you finish, and before reporting, read the posts for you:

```sh
grep -n -A6 -E '@(t03|all)\b|· announce ·' "<plan folder>/chat.md"
```

- An `ask` for you: answer it if you can, otherwise post that you cannot and why.
- An `announce` that changes something you use: adapt your files, or post a `finding` if it breaks an Agreed interface.
- A `finding` for you: fix it in your own files if your job is still writing; otherwise leave it, the fix stage takes it.

## Rules

- Only the owner edits its files. A problem in another job's file is a `finding`, never an edit.
- Never wait idle for a reply. Keep working on the plan's best reading and adapt when the answer comes.
- Every report lists its posts under `posted:` with type and @mentions, so the orchestrator can wake the right job.
- Reviewers link each PR comment to its chat post, and fix jobs close the post when they fix it, so the chat holds the whole conversation.
- At each stage end, the record job copies every post without a `closes` into the Open chat posts table of `board.md`.

## Board status lines

Jobs never edit `board.md`. Append one line to `board-log.md` instead:

```sh
echo "- $(date -u +%FT%TZ) t03 done: 4 files, scenario added" >> "<plan folder>/board-log.md"
```

Status words: `writing`, `done`, `merged`, `blocked`, `reviewing`, `clean`, `findings`, `fixed`, `pass`, `fail`. Record jobs fold these lines into the tables at each stage end.
