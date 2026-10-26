import { describe, expect, it } from "bun:test";
import { zeroFallbackCheck } from "@workspace/rules/checks/absence/zero-fallback.check";
import { readFlaggedLines } from "@workspace/rules/services/checks/read-flagged-lines.service";

const servicePath = "apps/server/src/services/roles/delete-role.service.ts";

describe("zeroFallbackCheck", () => {
  it("flags zero standing in for a missing row", () => {
    expect(
      readFlaggedLines(
        zeroFallbackCheck,
        servicePath,
        [
          "const total = assignments === undefined ? 0 : assignments.total;",
          "const count = rows[0]?.total ?? 0;",
        ].join("\n"),
      ),
    ).toEqual([1, 2]);
  });

  it("accepts other zero values", () => {
    expect(
      readFlaggedLines(
        zeroFallbackCheck,
        servicePath,
        [
          'const timeout = type === "loading" ? 0 : defaultTimeout;',
          "const delay = configured ?? 0.5;",
          "const index = 0;",
        ].join("\n"),
      ),
    ).toEqual([]);
  });

  it("applies only to server source outside tests and fixtures", () => {
    expect(zeroFallbackCheck.appliesTo(servicePath)).toBe(true);
    expect(
      zeroFallbackCheck.appliesTo("apps/server/src/routes/roles/roles.test.ts"),
    ).toBe(false);
    expect(
      zeroFallbackCheck.appliesTo(
        "apps/server/src/db/testing/fixtures/accounts/insert-account.service.ts",
      ),
    ).toBe(false);
    expect(
      zeroFallbackCheck.appliesTo("packages/ui/src/services/toast.service.ts"),
    ).toBe(false);
  });
});
