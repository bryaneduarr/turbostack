# Development commands

Evidence: 2026-10-13; `0ebf76b`; manifests inspected, no application changes; commands not executed.

- Declared toolchain: Bun `1.4.0`, Node `>=20`.
- Root: `bun install`; `bun run dev`; `bun run check-types`; `bun run lint`.
- Scoped server checks: `bun run --cwd apps/server check-types`; `bun run --cwd apps/server lint`. Other owning packages expose their own scripts; inspect before using.
- Sources: [root manifest](../../../package.json), [server scripts](../../../apps/server/package.json), [verification guide](../../methods/verification-and-tools.md).
