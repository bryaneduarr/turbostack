# Plan auditor questions

The whole change against `plan.md`. Rules reviewers see one slice each; this auditor is the only one who checks that the team built the plan, all of it, and only it. Every finding is must-fix.

1. **Coverage:** Is every plan step present in the diff? Name the step and the `path:line` that builds it.
2. **Nothing extra:** Is anything in the diff not asked for by the plan? An addition outside the scope fence is a finding, even when it looks useful.
3. **Choices:** Is each choice in the plan followed exactly, and does no rejected option appear?
4. **Done when:** For each Done when line, which `path:line` builds it and which browser scenario proves it?
5. **Interfaces:** Do both sides of every Agreed interface match: path, export names, and shapes?
6. **Edge cases:** Is every edge case in the plan's step table handled where the table says, with the outcome it says?
7. **Words:** Is every message a person sees the wording the plan gives, or plain and clear where the plan gives none?
8. **Chat:** Does every `finding` and `ask` in the chat have a `closes` post or a matching fix in the diff?
9. **Decisions:** Does each `decided` line on the board fit the vision and the plan? Name any that contradict it.
