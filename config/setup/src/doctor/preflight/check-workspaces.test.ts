import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { checkWorkspaces } from "@workspace/setup/doctor/preflight/check-workspaces.service";

const workspaceGlobs = ["apps/*", "config/*", "packages/*"];

let root: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), "setup-workspaces-"));
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

async function writeManifest(
  relativePath: string,
  manifest: Readonly<Record<string, unknown>>,
): Promise<void> {
  await Bun.write(path.join(root, relativePath), JSON.stringify(manifest));
}

describe("checkWorkspaces", () => {
  it("ignores manifests written by builds and dependency folders", async () => {
    await writeManifest("package.json", { workspaces: workspaceGlobs });
    await writeManifest("apps/server/package.json", { name: "server" });
    await writeManifest("apps/client/package.json", { name: "client" });
    await writeManifest("apps/server/.next/package.json", { type: "commonjs" });
    await writeManifest("apps/client/.next/package.json", {
      type: "commonjs",
    });
    await writeManifest("packages/ui/dist/package.json", { type: "module" });
    await writeManifest("node_modules/some-package/package.json", {
      name: "some-package",
    });

    expect(await checkWorkspaces(root)).toEqual([]);
  });

  it("reports a real workspace that no workspace glob covers", async () => {
    await writeManifest("package.json", { workspaces: workspaceGlobs });
    await writeManifest("apps/server/package.json", { name: "server" });
    await writeManifest("apps/client/.next/package.json", {
      type: "commonjs",
    });
    await writeManifest("tools/deploy/package.json", { name: "deploy" });

    expect(await checkWorkspaces(root)).toEqual([
      {
        summary: "Workspace tools/deploy is not covered by package.json",
        reason: "bun install does not link a package that no workspace matches",
        fix: 'add "tools/deploy" to the workspaces list in package.json',
      },
    ]);
  });

  it("reports a listed workspace folder that is missing on disk", async () => {
    await writeManifest("package.json", {
      workspaces: ["apps/*", "apps/gone"],
    });
    await writeManifest("apps/server/package.json", { name: "server" });

    expect(await checkWorkspaces(root)).toEqual([
      {
        summary: "Workspace apps/gone is listed but missing",
        reason: "package.json lists a folder that is not on disk",
        fix: "bun install",
      },
    ]);
  });
});
