import env from "@/config/environment/server-env.config";

const errorNames = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "SyntaxError",
  "ReferenceError",
  "URIError",
  "AggregateError",
  "ValidationError",
  "ParseError",
  "PostgresError",
]);
const errorCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EACCES",
  "ENOENT",
  "23505",
  "23503",
  "23502",
  "28000",
  "28P01",
  "53300",
  "57P01",
]);

export function serializeLogError(value: unknown) {
  if (!(value instanceof Error)) return { type: "UnknownError" };

  const code: unknown = Reflect.get(value, "code");
  const stack = value.stack ?? "";
  const prefix = value.message ? `${value.name}: ${value.message}` : value.name;
  const frames = stack.startsWith(prefix) ? stack.slice(prefix.length) : "";
  // Raw messages and database error properties can contain credentials or input.
  return {
    type: errorNames.has(value.name) ? value.name : "Error",
    ...(typeof code === "string" && errorCodes.has(code) ? { code } : {}),
    // Only local source locations are retained, never the message or absolute path.
    ...(env.NODE_ENV === "development"
      ? {
          locations: [
            ...frames
              .slice(0, 16000)
              .matchAll(
                /(?:^|\n)\s+at [^\n]*?((?:apps\/server\/)?(?:dist\/)?src\/[a-zA-Z0-9_./-]+\.[cm]?[jt]sx?:\d+:\d+)/g,
              ),
          ]
            .slice(0, 8)
            .flatMap((match) => {
              const location = match[1];
              return typeof location === "string" ? [location] : [];
            }),
        }
      : {}),
  };
}
