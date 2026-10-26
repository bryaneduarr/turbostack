const maximumTitleLength = 50;
const maximumBodyLineLength = 72;

const conventionalTitlePattern =
  /^(feat|fix|refactor|perf|style|docs|test|build|ci|chore|revert)(\([a-z0-9-]+\))?!?: \S/;
const toolAttributionPattern =
  /^co-authored-by:.*\b(claude|anthropic|copilot|chatgpt|openai|gpt)\b|generated with/im;
const singleTokenPattern = /^\S+$/;

export function describeCommitMessageProblems(message: string): string[] {
  const [title = "", separator, ...body] = message.trimEnd().split("\n");
  const problems: string[] = [];

  if (!conventionalTitlePattern.test(title)) {
    problems.push(`Title "${title}" is not a Conventional Commit title.`);
  }
  if (title.length > maximumTitleLength) {
    problems.push(
      `Title is ${title.length} characters; keep it at ${maximumTitleLength} or fewer.`,
    );
  }
  if (title.endsWith(".")) {
    problems.push("Title ends with a period.");
  }
  if (separator !== "" || body.every((line) => line.trim() === "")) {
    problems.push(
      "Add a body after one blank line explaining what changed and why.",
    );
  }
  for (const line of body) {
    if (line.length > maximumBodyLineLength && !singleTokenPattern.test(line)) {
      problems.push(
        `Body line is ${line.length} characters; wrap at ${maximumBodyLineLength}: "${line}"`,
      );
    }
  }
  if (toolAttributionPattern.test(message)) {
    problems.push("Remove AI or tool attribution.");
  }

  return problems;
}
