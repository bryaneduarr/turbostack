# Stack tool pitfalls

Evidence: 2026-10-28; `9336cc7`; run with another project's stack present.

- Stacks are found by Compose labels, so another project's stack counts toward the cap and looks idle; the reaper can stop it. Raise `DC_IDLE_MINUTES` and `DC_MAX_STACKS` while both run.
- A work tree runs its own `scripts/dc`; on an older branch, call the newest script from that folder.
- `dc-smoke-test` refuses to run while any stack runs.
