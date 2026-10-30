---
name: project-context
description: "Record what a session implemented, rejected, decided, and learned in .agents/project-context/, and keep the notes accurate. Use at the end of every session that changed, decided, or rejected anything; before relying on an existing note; and when writing or updating a note. Skip for explicit read-only requests."
---

# Project context upkeep

Keeps `.agents/project-context/` true so the next session does not rediscover or re-propose anything. Run it without being asked.

## Output

Updated or new topic notes under `.agents/project-context/<category>/<specific-topic>.md`, plus pointers in the startup index. No commits or pushes.

## End-of-session recap

Record each of these:

- **Implemented**: what now exists, its owner paths, and what was checked.
- **Rejected**: what the user does not want, so it is never proposed again.
- **Decided**: every decision the user made, with the reason when given.
- **Learned**: discoveries, pitfalls, and limits that prevent repeated discovery.
- **Next**: the next action and any open questions, kept as unknowns.
- **Lessons**: each correction, rejection, approval with changes, or praise from the user, as one line in `.agents/project-context/lessons/` (`- <YYYY-MM-DD> · When <situation>, <do this>, because <reason>.`). Replace a lesson the user contradicts.

How:

- Update the matching topic note. If none fits, add `.agents/project-context/<category>/<specific-topic>.md` and link it from the startup index.
- Split by topic rather than growing one note past its limit.
- Record only what the user said or what you checked. Never invent decisions, scope, or priorities.
- Replace or remove facts that became stale. Do not append history.
- Skip updates that add no useful knowledge.

## Note format

- **Limits**: startup index 120 words, topic note 80, including evidence. The capability map and lessons files (at most 25 lessons each) are exempt.
- **Content**: concise bullets and source links. Never copy code, rules, transcripts, raw logs, or speculative inventories.
- **Stamp**: each topic note records inspected Git revision, relevant uncommitted changes, and evidence paths/symbols or actual commands and results.
- **Evidence labels**: separate source-inspected facts, user-confirmed intent, and specifically checked outcomes. Never imply runtime verification from inspection or type checks.

## Keeping notes true

- Before relying on a note, reconcile it with current sources and relevant Git changes. Correct, replace, or remove stale facts.
- If the recorded revision cannot be compared, say so and inspect current evidence.
- Notes are navigation aids, never authority over rules or code.
- Add notes lazily, only when they prevent repeated discovery.

## Authority

- Update facts and progress on your own.
- Priorities, product scope, architecture decisions, and rule changes are user-controlled. Record them only after the user decides.
- Upkeep adds no background service, automatic commits, or pushes. Syncing across machines needs a deliberate Git step.

## Editing

- Re-read a file before editing it. Reconcile concurrent changes instead of overwriting them.
