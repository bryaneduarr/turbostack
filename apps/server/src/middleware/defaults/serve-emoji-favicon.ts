import type { MiddlewareHandler } from "hono";

/**
 * Middleware to serve a dynamic SVG favicon using a specified emoji.
 *
 * @param emoji - The emoji character to display as the favicon.
 * @returns MiddlewareHandler that serves the emoji favicon for "/favicon.ico" requests.
 *
 * When a request is made to "/favicon.ico", this middleware responds with an SVG image
 * containing the provided emoji. For all other requests, it calls the next middleware.
 *
 * It is used because in some request there are errors showing a non-existing './favicon'
 */
export function serveEmojiFavicon(emoji: string): MiddlewareHandler {
  return async (c, next) => {
    if (c.req.path === "/favicon.ico") {
      c.header("Content-Type", "image/svg+xml");

      // Show the emoji in here, this is what we see in the favicon.
      return c.body(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="-0.1em" font-size="90">${emoji}</text></svg>`,
      );
    }

    return next();
  };
}
