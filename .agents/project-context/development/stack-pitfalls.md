# Stack tool pitfalls

Evidence: 2026-10-28; branch `template/06-isolated-stacks`; checked with another project's stack running.

- `scripts/dc` manages only containers labeled `dc.managed`; a copy of the tool without the label is invisible to it.
- All projects from the template share `~/.local/state/dc/v1`, so they share the stack cap.
- Two checkouts with one container prefix get exit 78; set `NEW_CONTAINER_PREFIX`, run `bun run rename-scope`.
- A work tree runs its own `scripts/dc`; on an older branch, call the newest script from that folder.
