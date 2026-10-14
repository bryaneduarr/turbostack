/* Supplies the parts used to build one API request URL. */
export interface BuildRequestUrlInput {
  /* Identifies the API origin the path is resolved against. */
  baseUrl: string;
  /* Contains the route path template with `:name` path parameters. */
  path: string;
  /* Contains values for the path parameters, or null when the path declares none. */
  params: Record<string, unknown> | null;
  /* Contains query-string values, or null when the route reads no query string. */
  query: Record<string, unknown> | null;
}
