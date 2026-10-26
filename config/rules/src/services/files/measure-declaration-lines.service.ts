// Biome ends every type declaration with ";" or a column-zero "}", so the
// first such line closes it.
export function measureDeclarationLines(
  lines: readonly string[],
  startIndex: number,
): number {
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (line.trimEnd().endsWith(";") && !line.startsWith(" ")) {
      return index - startIndex + 1;
    }
    if (line.startsWith("}") || line.trimEnd().endsWith("{}")) {
      return index - startIndex + 1;
    }
  }
  return lines.length - startIndex;
}
