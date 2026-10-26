import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeEnvironmentAssignment } from "@workspace/setup/environment/write-environment-assignment.service";

let directory: string;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "setup-env-"));
});

afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
});

async function writeEnvFile(content: string): Promise<string> {
  const filePath = join(directory, ".env");
  await writeFile(filePath, content);
  return filePath;
}

describe("writeEnvironmentAssignment", () => {
  it("replaces the first matching line and keeps the others in order", async () => {
    const filePath = await writeEnvFile("A=1\nNAME=old\nB=2\n");

    const changed = await writeEnvironmentAssignment(filePath, "NAME", "new");

    expect(changed).toBe(true);
    expect(await readFile(filePath, "utf8")).toBe("A=1\nNAME=new\nB=2\n");
  });

  it("leaves commented example lines untouched", async () => {
    const filePath = await writeEnvFile("# SMTP_USER=\n# SMTP_PASSWORD=\n");

    const changed = await writeEnvironmentAssignment(
      filePath,
      "SMTP_USER",
      "example@example.com",
    );

    expect(changed).toBe(true);
    expect(await readFile(filePath, "utf8")).toBe(
      "# SMTP_USER=\n# SMTP_PASSWORD=\nSMTP_USER=example@example.com\n",
    );
  });

  it("appends the assignment once when the file has no matching line", async () => {
    const filePath = await writeEnvFile("A=1");

    const changed = await writeEnvironmentAssignment(filePath, "NAME", "value");

    expect(changed).toBe(true);
    expect(await readFile(filePath, "utf8")).toBe("A=1\nNAME=value\n");
  });

  it("does not add a blank line when the file already ends with a newline", async () => {
    const filePath = await writeEnvFile("A=1\n");

    await writeEnvironmentAssignment(filePath, "NAME", "value");

    expect(await readFile(filePath, "utf8")).toBe("A=1\nNAME=value\n");
  });

  it("returns false and leaves the bytes unchanged when the value is already set", async () => {
    const content = "A=1\nNAME=value\n";
    const filePath = await writeEnvFile(content);

    const changed = await writeEnvironmentAssignment(filePath, "NAME", "value");

    expect(changed).toBe(false);
    expect(await readFile(filePath, "utf8")).toBe(content);
  });

  it("replaces only the first of two identical assignments", async () => {
    const filePath = await writeEnvFile("NAME=old\nNAME=old\n");

    await writeEnvironmentAssignment(filePath, "NAME", "new");

    expect(await readFile(filePath, "utf8")).toBe("NAME=new\nNAME=old\n");
  });
});
