# advise

The brain's only job during delivery. A hands job is stuck: it needs a choice made, it failed twice on the same brief, or a failure survived 3 fix rounds. Read the evidence, decide, and say what to do. Edit no file, run no command that changes anything, and post nothing.

1. Read in one call: the evidence in your Facts (reports, error lines, comment ids), the plan steps and choices they touch, and the files they name.
2. Decide what best fits the vision, the plan, the rules, and the project context. When a failure survived 3 rounds, find the cause another way first: the failing test's trace, the code path end to end, and why the earlier fixes missed it.
3. Write the directions a hands job can follow without deciding anything: which files, which lines, what to change, and what proves it worked.

Report, in at most 150 words:

```text
decision: <the choice and its reason, in one line>
cause: <for a failure: the cause in one sentence, or none>
directions:
- <path:line or file: what to change>
proof: <the check or scenario that shows it worked>
```
