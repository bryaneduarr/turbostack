# Fast checks measurements

- **Date:** 2026-10-28 UTC
- **Git HEAD:** `759ac4e` (the fast-checks changes were uncommitted on top)
- **Machine:** 28 cores, 15 GB RAM
- **Container:** the Turbostack workspace container has a 6 GiB memory limit and 8 CPUs, so 80 % is 4.8 GiB.
- **Measured:** `bun run test:e2e -- --project=api --project=chromium --workers=N` for N = 3, 4, 6, 8, 10, 12. Each run had 7 tests. Wall time is Playwright's own summary time. Memory came from a streaming `docker stats` on the workspace container, about 7 to 8 samples per run. No run failed and no run passed 80 %, so all six values ran.

## Results

| Workers | Wall time | Peak memory | Peak % of limit | Result |
| ------: | --------: | ----------: | --------------: | ------ |
| 3       | 2.9 s     | 1410 MiB    | 22.95 %         | 7 passed |
| 4       | 3.6 s     | 1505 MiB    | 24.49 %         | 7 passed |
| 6       | 2.9 s     | 1795 MiB    | 29.22 %         | 7 passed |
| 8       | 3.1 s     | 1588 MiB    | 25.85 %         | 7 passed |
| 10      | 3.0 s     | 1921 MiB    | 31.27 %         | 7 passed |
| 12      | 3.0 s     | 1674 MiB    | 27.25 %         | 7 passed |

## Choice

- **Chosen: 3 workers.** The fastest time is 2.9 s (N = 3 and N = 6 tie). Three is the smallest value within 5 % of that (2.9 s × 1.05 ≈ 3.05 s), so it is the default.
- **Why the gain is flat:** there are only 7 tests, so more than 7 workers cannot add parallel work. The run-to-run noise (N = 4 took 3.6 s) is larger than the differences between N values.
- **Memory:** the highest peak was 31 % at N = 10, well below the 80 % limit.
- **Discarded first attempt:** an earlier sampler used `docker stats --no-stream` every 3 s. It produced only 2 samples per run, too few for a peak, so those numbers were thrown away and every N was re-run with the streaming sampler.

## Verify step times (full run, passing)

```
PASS     Lockfile matches package manifests (0.0s)
PASS     Formatting and lint (Biome) (0.4s)
PASS     Package boundaries (0.1s)
PASS     Project rules (0.1s)
PASS     Compose (0.0s)
PASS     Migrations match the tables (0.7s)
PASS     Types and builds (5.1s)
PASS     Browser tests (API and Chromium) (5.9s)

All 8 checks passed.
```
