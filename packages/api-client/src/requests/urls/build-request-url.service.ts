import type { BuildRequestUrlInput } from "@workspace/api-client/types/requests/build-request-url.interface";

function serializeUrlValue(name: string, value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }
  throw new TypeError(
    `"${name}" must be a string, number, boolean, or bigint.`,
  );
}

export function buildRequestUrl({
  baseUrl,
  path,
  params,
  query,
}: BuildRequestUrlInput): URL {
  const resolvedPath = path.replace(
    /:([A-Za-z0-9_]+)/g,
    (_segment, name: string) => {
      if (params === null || !(name in params)) {
        throw new TypeError(`Missing path parameter "${name}".`);
      }
      return encodeURIComponent(serializeUrlValue(name, params[name]));
    },
  );
  const url = new URL(resolvedPath, baseUrl);

  if (query !== null) {
    for (const [name, value] of Object.entries(query)) {
      // Absent optional query values are omitted rather than sent as text.
      if (value === undefined) continue;
      for (const item of Array.isArray(value) ? value : [value]) {
        url.searchParams.append(name, serializeUrlValue(name, item));
      }
    }
  }

  return url;
}
