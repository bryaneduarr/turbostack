import type { PreContext } from "elysia";

export function serveEmojiFavicon(emoji: string) {
  return ({ request }: PreContext) => {
    if (new URL(request.url).pathname === "/favicon.ico") {
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="-0.1em" font-size="90">${emoji}</text></svg>`,
        { headers: { "content-type": "image/svg+xml" } },
      );
    }
  };
}
