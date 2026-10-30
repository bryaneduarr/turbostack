# Scheduling

How the orchestrator keeps its N agent slots busy. The prompt repeats these rules, because the orchestrator reads no files.

## Ready jobs, in order

A job is ready when its inputs exist: an implement job when every task it needs reported `done`, a fix job when its slice's reviews finished. Start ready jobs in this order:

1. Tasks on the critical path: the task with the longest chain of tasks waiting on it goes first.
2. Then by size: `L`, then `M`, then `S` (the board gives each task's size).
3. Then everything else in board order.

## Rolling start

Use this whenever the harness allows it: it starts a subagent in the background and wakes the orchestrator when that one finishes. Keep N jobs running: each time one finishes, start the next ready job at once.

## Batches

When the harness's subagent tool returns only after every call in the message finishes, a batch lasts as long as its slowest job, and every other slot sits idle until then. In a measured 22-task delivery this left about 2.5 hours of slots idle in 3 hours 15 minutes.

- Fill each batch with jobs of one size class: an `S` job beside an `L` job leaves its slot empty for most of the batch.
- Put the critical-path task in the first batch it is ready for, and fill the rest with ready jobs of its size.
- Mix sizes only when nothing else is ready.
- Start every ready job you have a slot for; never hold one back to wait for a later job.

## Sizes

Measured in a 22-task delivery (one agent per task, medium-sized briefs): `S` about 1 to 2 minutes (one or two files, or mirroring one file), `M` about 3 to 5 minutes, `L` about 5 to 10 minutes (new logic across five or more files, or a set of browser scenarios).
