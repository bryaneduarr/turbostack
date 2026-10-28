# Rule enforcement

Evidence: 2026-10-28; `chore/fast-checks` on `759ac4e`; `bun run check:rules` passed, and a throwaway `config/rules/src/x.test.ts` failed it. Grit plugins last triggered 2026-10-26.

- `bun run check:rules` runs [config/rules](../../../config/rules/src/check-rules.script.ts): 22 checks; reviewed exceptions in `config/rules/src/config/exceptions/`. `unit-test-ban` rejects `*.test.*` and `*.spec.*` files.
- Grit plugins in `config/biome/plugins/` load from the root [biome.json](../../../biome.json); every package `biome.json` must use `"extends": "//"` or plugins silently skip it.
- Learned: the old `/* */` contract comments fail the checker; it wants `/** */`.
