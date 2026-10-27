/** Names one response header and its value. */
export type SecurityHeader = readonly [name: string, value: string];

/** Describes the security policy one web app sends with every response. */
export interface SecurityHeadersInput {
  /** Contains the complete Content-Security-Policy value. */
  contentSecurityPolicy: string;
  /** Selects how much of the URL other sites see when a page links to them. */
  referrerPolicy: "no-referrer" | "strict-origin-when-cross-origin";
  /** Adds Strict-Transport-Security, which only belongs on production HTTPS origins. */
  production: boolean;
}
