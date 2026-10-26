# Rule enforcement

Evidence: 2026-10-26; `5952692` plus uncommitted step 2 of the template port; `bun run check` passed; a throwaway file triggered the Grit plugins.

- `bun run check:rules` runs [config/rules](../../../config/rules/src/check-rules.script.ts): 22 checks; reviewed exceptions in `config/rules/src/config/exceptions/`.
- Grit plugins in `config/biome/plugins/` load from the root [biome.json](../../../biome.json); every package `biome.json` must use `"extends": "//"` or plugins silently skip it.
- Learned: the old `/* */` contract comments fail the checker; it wants `/** */`.
