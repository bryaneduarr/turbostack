import { describe, expect, it } from "bun:test";
import { fileNameCheck } from "@workspace/rules/checks/naming/file-name.check";
import { createSourceFile } from "@workspace/rules/services/files/create-source-file.service";

function messagesFor(path: string): string[] {
  return fileNameCheck
    .check(createSourceFile(path, ""))
    .map(({ message }) => message);
}

describe("fileNameCheck", () => {
  it("accepts role-named files, tests, and framework-required names", () => {
    for (const path of [
      "apps/server/src/routes/sign-in/sign-in.handler.ts",
      "apps/server/src/routes/sign-in/sign-in.test.ts",
      "apps/client/src/e2e/sign-in/sign-in.e2e.ts",
      "apps/client/src/app/organizations/[organizationId]/page.tsx",
      "apps/client/src/proxy.ts",
    ]) {
      expect(messagesFor(path)).toEqual([]);
    }
  });

  it("rejects missing roles, unknown roles, and vague names", () => {
    expect(messagesFor("packages/ui/src/services/format.ts")).toHaveLength(1);
    expect(
      messagesFor("packages/ui/src/services/format-date.helper.ts")[0],
    ).toContain('Unknown role ".helper"');
    expect(
      messagesFor("packages/ui/src/services/utils.service.ts")[0],
    ).toContain("vague name");
    expect(messagesFor("packages/ui/src/services/page.tsx")).toHaveLength(1);
  });
});
