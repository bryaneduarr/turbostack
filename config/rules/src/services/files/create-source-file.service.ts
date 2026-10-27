import type { SourceFile } from "@workspace/rules/types/files/source-file.interface";

export function createSourceFile(path: string, text: string): SourceFile {
  return { path, text, lines: text.split("\n") };
}
