import { describe, expect, it } from "bun:test";
import { fileLengthCheck } from "@workspace/rules/checks/size/file-length.check";
import { createSourceFile } from "@workspace/rules/services/files/create-source-file.service";
import { isCheckedSourceFile } from "@workspace/rules/services/files/is-checked-source-file.service";

function linesOf(count: number) {
  return `${"const value = 1;\n".repeat(count)}`;
}

function violationsFor(path: string, lineCount: number) {
  return fileLengthCheck.check(createSourceFile(path, linesOf(lineCount)));
}

describe("fileLengthCheck", () => {
  it("accepts source and test files of at most 200 lines", () => {
    for (const path of [
      "apps/server/src/services/sign-in.service.ts",
      "apps/server/src/routes/sign-in/sign-in.test.ts",
      "apps/client/src/e2e/sign-in/sign-in.e2e.ts",
    ]) {
      expect(violationsFor(path, 200)).toEqual([]);
    }
  });

  it("rejects source and test files of 201 lines", () => {
    for (const path of [
      "apps/server/src/services/sign-in.service.ts",
      "apps/server/src/routes/sign-in/sign-in.test.ts",
      "apps/client/src/e2e/sign-in/sign-in.e2e.ts",
    ]) {
      expect(violationsFor(path, 201)).toHaveLength(1);
    }
  });

  it("does not check generated declaration or migration files", () => {
    expect(fileLengthCheck.appliesTo("apps/client/next-env.d.ts")).toBe(false);
    expect(
      isCheckedSourceFile("packages/database/src/migrations/0001_example.ts"),
    ).toBe(false);
  });
});
