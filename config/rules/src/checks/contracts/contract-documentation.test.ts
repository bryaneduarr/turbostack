import { describe, expect, it } from "bun:test";
import { interfaceDocumentationCheck } from "@workspace/rules/checks/contracts/interface-documentation.check";
import { schemaFieldDocumentationCheck } from "@workspace/rules/checks/contracts/schema-field-documentation.check";
import { createSourceFile } from "@workspace/rules/services/files/create-source-file.service";

function linesFlaggedBy(
  check: typeof interfaceDocumentationCheck,
  path: string,
  lines: string[],
): number[] {
  return check
    .check(createSourceFile(path, lines.join("\n")))
    .map(({ line }) => line);
}

describe("interfaceDocumentationCheck", () => {
  const path = "packages/schemas/src/server/sign-in/sign-in.interface.ts";

  it("requires a JSDoc comment above each interface and member", () => {
    const flagged = linesFlaggedBy(interfaceDocumentationCheck, path, [
      "/** Represents credentials. */",
      "export interface Credentials {",
      "  /** Identifies the account. */",
      "  email: string;",
      "  password: string;",
      "}",
      "",
      "export type Kind = Credentials['email'];",
    ]);

    expect(flagged).toEqual([5, 8]);
  });

  it("rejects line and plain block comments", () => {
    const flagged = linesFlaggedBy(interfaceDocumentationCheck, path, [
      "// Represents credentials.",
      "export interface Credentials {",
      "  /* Identifies the account. */",
      "  email: string;",
      "}",
    ]);

    expect(flagged).toEqual([2, 4]);
  });
});

describe("schemaFieldDocumentationCheck", () => {
  const path = "packages/schemas/src/server/sign-in/sign-in.schema.ts";

  it("requires a comment above every field, including nested objects", () => {
    const flagged = linesFlaggedBy(schemaFieldDocumentationCheck, path, [
      "export const signInSchema = z.object({",
      "  /** Identifies the account. */",
      "  email: z.email(),",
      "  profile: z.object({",
      "    /** Names the account holder. */",
      "    name: z.string(),",
      "    nickname: z",
      "      .string()",
      "      .optional(),",
      "  }),",
      "});",
    ]);

    expect(flagged).toEqual([4, 7]);
  });

  it("flags one-line object schemas that cannot hold field comments", () => {
    const flagged = linesFlaggedBy(schemaFieldDocumentationCheck, path, [
      "export const nameSchema = z.object({ name: z.string() });",
      "export const emptySchema = z.object({});",
    ]);

    expect(flagged).toEqual([1]);
  });
});
