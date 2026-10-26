import { describe, expect, it } from "bun:test";
import { optionalChainingCheck } from "@workspace/rules/checks/absence/optional-chaining.check";
import { readFlaggedLines } from "@workspace/rules/services/checks/read-flagged-lines.service";

const sourcePath = "apps/server/src/services/roles/delete-role.service.ts";

describe("optionalChainingCheck", () => {
  it("accepts regex results, Map lookups, and index access", () => {
    expect(
      readFlaggedLines(
        optionalChainingCheck,
        sourcePath,
        [
          "const name = /^(\\w+)/.exec(line)?.[1];",
          "const count = text.match(pattern)?.length;",
          "const isOwner = byAccount.get(account.id)?.isOwner;",
          "const first = rows[0]?.total;",
          "const ratio = enabled ? 0.5 : 1;",
          'const message = "Use ?. only after a regex result";',
        ].join("\n"),
      ),
    ).toEqual([]);
  });

  it("flags optional chaining on any other value", () => {
    expect(
      readFlaggedLines(
        optionalChainingCheck,
        sourcePath,
        [
          "const email = account?.email;",
          "const status = response?.status();",
          "const roles = readRoles(account)?.map(({ id }) => id);",
          "const name = rows[0]?.owner?.name;",
        ].join("\n"),
      ),
    ).toEqual([1, 2, 3, 4]);
  });

  it("does not apply to tests or test support", () => {
    expect(optionalChainingCheck.appliesTo(sourcePath)).toBe(true);
    expect(
      optionalChainingCheck.appliesTo(
        "apps/server/src/routes/roles/roles.test.ts",
      ),
    ).toBe(false);
    expect(
      optionalChainingCheck.appliesTo(
        "apps/server/src/db/testing/fixtures/accounts/insert-account.service.ts",
      ),
    ).toBe(false);
  });
});
