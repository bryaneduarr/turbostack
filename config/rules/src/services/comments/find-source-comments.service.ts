import { createLineLocator } from "@workspace/rules/services/files/create-line-locator.service";
import type { SourceComment } from "@workspace/rules/types/comments/source-comment.interface";

const regexPrecedingCharacters = new Set("(,=:[!&|?{};+-*%<>~^");

const regexPrecedingKeywords = new Set([
  "await",
  "case",
  "delete",
  "do",
  "else",
  "in",
  "of",
  "return",
  "throw",
  "typeof",
  "void",
  "yield",
]);

function startsRegularExpression(text: string, slashIndex: number): boolean {
  const before = text.slice(0, slashIndex).trimEnd();
  const previous = before.at(-1);
  if (previous === undefined) return true;
  if (regexPrecedingCharacters.has(previous)) return true;
  const word = /[\w$]+$/.exec(before);
  return word !== null && regexPrecedingKeywords.has(word[0]);
}

// Unterminated quotes end at the line break, so an apostrophe in JSX text only
// hides the rest of its own line.
function skipQuoted(text: string, start: number, quote: string): number {
  let index = start + 1;
  while (index < text.length) {
    const character = text[index];
    if (character === "\\") index += 2;
    else if (character === quote || character === "\n") return index + 1;
    else index += 1;
  }
  return index;
}

function skipRegularExpression(text: string, start: number): number {
  let index = start + 1;
  let inClass = false;
  while (index < text.length) {
    const character = text[index];
    if (character === "\\") index += 2;
    else if (character === "\n") return index;
    else {
      if (character === "[") inClass = true;
      else if (character === "]") inClass = false;
      else if (character === "/" && !inClass) return index + 1;
      index += 1;
    }
  }
  return index;
}

export function findSourceComments(text: string): SourceComment[] {
  const lineAt = createLineLocator(text);
  const comments: SourceComment[] = [];
  const templateBraceDepths: number[] = [];
  let inTemplate = false;
  let index = 0;

  while (index < text.length) {
    const character = text[index];
    const next = text[index + 1];

    if (inTemplate) {
      if (character === "\\") index += 2;
      else if (character === "`") {
        inTemplate = false;
        index += 1;
      } else if (character === "$" && next === "{") {
        templateBraceDepths.push(0);
        inTemplate = false;
        index += 2;
      } else index += 1;
      continue;
    }

    if (character === "/" && next === "/") {
      const newline = text.indexOf("\n", index);
      const end = newline === -1 ? text.length : newline;
      comments.push({
        kind: "line",
        startLine: lineAt(index),
        endLine: lineAt(index),
        text: text.slice(index + 2, end),
      });
      index = end;
    } else if (character === "/" && next === "*") {
      const close = text.indexOf("*/", index + 2);
      const end = close === -1 ? text.length : close;
      comments.push({
        kind: "block",
        startLine: lineAt(index),
        endLine: lineAt(end),
        text: text.slice(index + 2, end),
      });
      index = end + 2;
    } else if (character === '"' || character === "'") {
      index = skipQuoted(text, index, character);
    } else if (character === "`") {
      inTemplate = true;
      index += 1;
    } else if (character === "/" && startsRegularExpression(text, index)) {
      index = skipRegularExpression(text, index);
    } else {
      const depth = templateBraceDepths.at(-1);
      if (depth !== undefined && character === "{") {
        templateBraceDepths[templateBraceDepths.length - 1] = depth + 1;
      } else if (depth !== undefined && character === "}") {
        if (depth === 0) {
          templateBraceDepths.pop();
          inTemplate = true;
        } else templateBraceDepths[templateBraceDepths.length - 1] = depth - 1;
      }
      index += 1;
    }
  }

  return comments;
}
