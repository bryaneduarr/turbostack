# Dev stack and test resources

Evidence: 2026-11-04; `b240d96` plus the Veyra port (`c196b26e..7268651b`); cgroup sampler, 3 cold `verify` and 2 `dev:start` runs each.

- Ported: heap caps, reduced motion, no trace or video, one Playwright run, 6 GiB limit, faster dev readiness.
- Not ported: lazy admin, worker poll, clock waits (absent here).
- Cold `verify` 8.9 to 8.4 s; dev warm ready 2.6 to 1.6 s.
- Unknown: gains at 172 tests; a linked tree on `.localhost`.
