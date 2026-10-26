import { describe, expect, it } from "bun:test";
import { aliasExportCheck } from "@workspace/rules/checks/contracts/alias-export.check";
import { readFlaggedLines } from "@workspace/rules/services/checks/read-flagged-lines.service";

function linesFlagged(text: string): number[] {
  return readFlaggedLines(
    aliasExportCheck,
    "packages/schemas/src/example.schema.ts",
    text,
  );
}

describe("aliasExportCheck", () => {
  it("flags an export that only renames another value", () => {
    expect(
      linesFlagged(
        "import { tokenSchema } from 'x';\nexport const inviteTokenSchema = tokenSchema;\n",
      ),
    ).toEqual([2]);
  });

  it("accepts literals, keywords, and derived schemas", () => {
    expect(
      linesFlagged(
        [
          "export const maximumNameCharacters = 64;",
          "export const enabled = true;",
          "export const inviteSchema = tokenSchema.extend({});",
          "export const roleIdsSchema = z.array(roleIdSchema);",
        ].join("\n"),
      ),
    ).toEqual([]);
  });
});
