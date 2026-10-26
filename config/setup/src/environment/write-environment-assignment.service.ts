import { readFile, writeFile } from "node:fs/promises";

export async function writeEnvironmentAssignment(
  filePath: string,
  name: string,
  value: string,
): Promise<boolean> {
  const content = await readFile(filePath, "utf8");
  const assignment = `${name}=${value}`;
  const lines = content.split("\n");
  const index = lines.findIndex((line) => line.startsWith(`${name}=`));

  let updated: string;
  if (index === -1) {
    const separator = content === "" || content.endsWith("\n") ? "" : "\n";
    updated = `${content}${separator}${assignment}\n`;
  } else {
    lines[index] = assignment;
    updated = lines.join("\n");
  }

  if (updated === content) return false;
  await writeFile(filePath, updated);
  return true;
}
