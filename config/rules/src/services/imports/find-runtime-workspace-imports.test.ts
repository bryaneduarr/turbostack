import { describe, expect, it } from "bun:test";
import { findRuntimeWorkspaceImports } from "@workspace/rules/services/imports/find-runtime-workspace-imports.service";

describe("findRuntimeWorkspaceImports", () => {
  it("finds value, multi-line, re-export, and dynamic imports", () => {
    const text = [
      'import { a } from "@workspace/utils/http/a.constant";',
      "import {",
      "  b,",
      '} from "@workspace/database/tables/b.table";',
      'export { c } from "@workspace/ui/c.component";',
      'const d = await import("@workspace/schemas/d.schema");',
    ].join("\n");

    expect(findRuntimeWorkspaceImports(text)).toEqual([
      { packageName: "@workspace/utils", line: 1 },
      { packageName: "@workspace/database", line: 2 },
      { packageName: "@workspace/ui", line: 5 },
      { packageName: "@workspace/schemas", line: 6 },
    ]);
  });

  it("ignores type-only imports and other packages", () => {
    const text = [
      'import type { A } from "@workspace/schemas/a.interface";',
      'import { z } from "zod";',
    ].join("\n");

    expect(findRuntimeWorkspaceImports(text)).toEqual([]);
  });
});
