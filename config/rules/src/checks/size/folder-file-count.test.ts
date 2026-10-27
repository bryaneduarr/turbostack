import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { folderFileCountCheck } from "@workspace/rules/checks/size/folder-file-count.check";
import { isExceptedViolation } from "@workspace/rules/services/exceptions/is-excepted-violation.service";
import type { RuleException } from "@workspace/rules/types/exceptions/rule-exception.interface";

const ruleId = "folder-file-count";

let rootPath: string;

beforeAll(async () => {
  rootPath = await mkdtemp(join(tmpdir(), "folder-file-count-"));
});

afterAll(async () => {
  await rm(rootPath, { recursive: true, force: true });
});

async function writeFiles(folder: string, count: number): Promise<string[]> {
  const paths: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const path =
      folder === "" ? `file-${index}.ts` : `${folder}/file-${index}.ts`;
    await mkdir(join(rootPath, folder), { recursive: true });
    await Bun.write(join(rootPath, path), "");
    paths.push(path);
  }
  return paths;
}

function violationsFor(trackedPaths: readonly string[]) {
  return folderFileCountCheck.check({ rootPath, trackedPaths });
}

describe("folderFileCountCheck", () => {
  it("rejects a folder holding more than the limit of direct files", async () => {
    const paths = await writeFiles("apps/example/src/exceeds", 11);

    expect(await violationsFor(paths)).toEqual([
      {
        ruleId,
        path: "apps/example/src/exceeds/",
        line: 1,
        message:
          "11 files directly in this folder; keep at most 10 and group them into descriptively named subfolders by responsibility.",
      },
    ]);
  });

  it("accepts a folder holding exactly the limit", async () => {
    const paths = await writeFiles("apps/example/src/equals-limit", 10);

    expect(await violationsFor(paths)).toEqual([]);
  });

  it("does not count files in subfolders", async () => {
    const direct = await writeFiles("apps/example/src/nested", 10);
    const nested = await writeFiles("apps/example/src/nested/child", 5);

    expect(await violationsFor([...direct, ...nested])).toEqual([]);
  });

  it("exempts generated migrations and their meta folder", async () => {
    const migrations = await writeFiles("packages/database/src/migrations", 12);
    const meta = await writeFiles("packages/database/src/migrations/meta", 12);

    expect(await violationsFor([...migrations, ...meta])).toEqual([]);
  });

  it("exempts repository and app root folders", async () => {
    const root = await writeFiles("", 12);
    const app = await writeFiles("apps/example", 12);

    expect(await violationsFor([...root, ...app])).toEqual([]);
  });

  it("does not count symbolic links", async () => {
    const regular = await writeFiles("apps/example/src/links", 10);
    const links = ["a.ts", "b.ts"].map(
      (name) => `apps/example/src/links/${name}`,
    );
    for (const link of links) {
      await symlink("../../../../../README.md", join(rootPath, link));
    }

    expect(await violationsFor([...regular, ...links])).toEqual([]);
  });

  it("suppresses a violation for a folder listed as a reviewed exception", async () => {
    const exception: RuleException = {
      ruleId,
      path: "apps/example/src/excepted/",
      reason: "Fixture exception for the exception-listing test.",
    };
    const paths = await writeFiles("apps/example/src/excepted", 11);
    const violations = await violationsFor(paths);

    expect(violations.map((violation) => violation.path)).toEqual([
      exception.path,
    ]);
    expect(
      violations.every((violation) =>
        isExceptedViolation(violation, [exception]),
      ),
    ).toBe(true);
  });
});
