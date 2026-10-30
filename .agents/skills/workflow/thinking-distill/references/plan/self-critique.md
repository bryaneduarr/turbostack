# Self-critique

The agent questions its own plan before the user sees it, and again on every idea it wants to add. Run every group the goal touches. Log each answer in `thinking.md` under Self-critique as one line: question, answer, effect (`changed: <what>`, `doubt <n>`, or `no change, because <reason>`). A group that does not apply gets one line: `n/a, because <reason>`.

## Question bank

- **Meaning:** What is the real problem behind the words? If I build exactly the words, what would the user call wrong? Which words could mean two things?
- **Data:** Where does each piece of data come from? Who owns it, where is it stored, how long does it live, and who can see it?
- **Failure:** How can each step fail, and what does the person see then? What if they skip a step, go back, reload, double-click, or two people act at once?
- **Worst case:** What is the worst realistic outcome: data loss, the wrong person seeing data, someone locked out, email spam? Can it be undone, and how would we notice?
- **Abuse:** Who must not be able to do this? What happens if someone calls the server directly and skips the screen?
- **Efficiency:** What happens with 0, 1, and 10,000 items? What is slow, and does it matter at today's size?
- **Alternatives:** Is there a simpler way, or something the project already has? What would doing half achieve?
- **Change:** Does it break older clients, existing data, or a planned change?
- **Undo:** How do we turn it off if it misbehaves in production? Can the database change be rolled back?
- **Seeing it:** How will we know it works in production? Which log, audit event, or error code shows it?
- **Time:** Does it handle expiry, time zones, delayed jobs, and clocks that differ between machines?
- **Old data:** What happens to records made before this feature existed?
- **Privacy:** Is there personal data? Who can delete it, and how long is it kept?
- **Cost:** Are there outside services, email volume, or storage growth to pay for?
- **Every screen:** Does it work on small screens, by keyboard, and without JavaScript?
- **Words:** Will a normal person understand every message the screen shows?
- **Proof:** Which browser scenario proves each Done when line? What can we not test here, and what proves it instead?
- **Value:** What would make this clearly more useful for a small cost? Every such idea runs through this whole bank again.
- **Scope:** Does each part trace to the goal sentence? Is this the terrain or the house?
- **Plan quality:** Is each task small enough for one agent? Could a new agent misread any step? Is the riskiest step done first? Do parallel tasks share any file? Is the longest needs chain 3 tasks or fewer? Does every task's spec leave nothing to decide, name the helpers it must reuse instead of copying, and give each `Risk: high` task its logic step by step?
- **Self-check:** Which wrong assumption would waste the most work? Could a new agent build this without asking anything? Which lesson did I ignore, and why?

## Scope fence

Prepare the terrain; do not build the house. When the request is X, the plan builds X and what X needs to work safely, not Y and Z because they are nearby.

- Every part names the goal-sentence words it serves. A part that serves none moves to Later.
- At most 3 small additions go in now. Each one must serve the goal sentence, pass the whole bank, and add no new service, no new table, and no more than one task. Everything else is Later, one line each with why it waits.
- Required safeguards are not extras: validation, permissions, error states, and the browser scenarios that prove the goal stay in.
- When an addition doubles a task count or needs its own plan to explain, it is a separate plan.

## Critic

Step 5 gives the brain critic subagent `thinking.md`, the draft `plan.md`, and this file, with this mission: "Find how this plan fails. Answer the bank as a stranger who must build it tomorrow. List each problem with the step it hits and a fix. Do not praise." Each finding becomes a plan change or a doubt.
