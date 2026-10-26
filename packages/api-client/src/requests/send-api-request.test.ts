import { afterAll, describe, expect, it } from "bun:test";
import { sendApiRequest } from "@workspace/api-client/requests/send-api-request.service";
import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import {
  BAD_GATEWAY,
  NOT_FOUND,
  OK,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { z } from "zod";

const echoRoute = {
  method: "POST",
  path: "/items/:itemId",
  params: z.object({ itemId: z.string() }),
  query: z.object({ tags: z.array(z.string()), limit: z.number() }),
  body: z.object({ name: z.string() }),
  response: createSuccessResponseSchema(
    z.object({ method: z.string(), url: z.string(), body: z.unknown() }),
  ),
} as const satisfies RouteDefinition;

const statusRoute = {
  method: "GET",
  path: "/status",
  params: null,
  query: null,
  body: null,
  response: createSuccessResponseSchema(z.object({ status: z.literal("ok") })),
} as const satisfies RouteDefinition;

const requestId = crypto.randomUUID();
const errorEnvelope = (code: string) => ({
  success: false,
  message: "Not found.",
  data: null,
  error: { code },
  status: NOT_FOUND,
  requestId,
});

const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/items/")) {
      return Response.json({
        success: true,
        message: "Echoed.",
        data: {
          method: request.method,
          url: `${url.pathname}${url.search}`,
          body: await request.json(),
        },
        error: null,
        status: OK,
        requestId,
      });
    }
    const scenario = request.headers.get("x-scenario");
    if (scenario === "failure") {
      return Response.json(errorEnvelope("NOT_FOUND"), { status: NOT_FOUND });
    }
    if (scenario === "unknown-code") {
      return Response.json(errorEnvelope("NEW_CODE"), { status: NOT_FOUND });
    }
    if (scenario === "proxy-error") {
      const echoedRequestId = request.headers.get("x-echo-request-id");
      return new Response("<html>Bad gateway</html>", {
        status: BAD_GATEWAY,
        headers:
          echoedRequestId === null ? {} : { "x-request-id": echoedRequestId },
      });
    }
    return Response.json({ success: true, data: { status: "unexpected" } });
  },
});
const baseUrl = server.url.toString();

afterAll(() => server.stop(true));

function sendStatusRequest(
  scenario: string,
  headers: Record<string, string> = {},
) {
  return sendApiRequest({
    baseUrl,
    route: statusRoute,
    params: null,
    query: null,
    body: null,
    init: { headers: { "x-scenario": scenario, ...headers } },
  });
}

describe("sendApiRequest", () => {
  it("sends the route's method, encoded path, query, and JSON body", async () => {
    const result = await sendApiRequest({
      baseUrl,
      route: echoRoute,
      params: { itemId: "a/b" },
      query: { tags: ["x", "y"], limit: 5 },
      body: { name: "Example" },
      init: {},
    });

    expect(result).toMatchObject({
      kind: "success",
      response: {
        data: {
          method: "POST",
          url: "/items/a%2Fb?tags=x&tags=y&limit=5",
          body: { name: "Example" },
        },
      },
    });
  });

  it("returns a documented error envelope as a failure", async () => {
    const result = await sendStatusRequest("failure");

    expect(result.kind).toBe("failure");
  });

  it("returns non-envelope errors and unknown error codes as unexpected responses", async () => {
    expect(await sendStatusRequest("proxy-error")).toEqual({
      kind: "unexpected-response",
      status: BAD_GATEWAY,
      requestId: null,
    });
    expect(await sendStatusRequest("unknown-code")).toEqual({
      kind: "unexpected-response",
      status: NOT_FOUND,
      requestId: null,
    });
  });

  it("keeps the request ID of an unexpected response when it is a UUID", async () => {
    const result = await sendStatusRequest("proxy-error", {
      "x-echo-request-id": requestId,
    });

    expect(result).toEqual({
      kind: "unexpected-response",
      status: BAD_GATEWAY,
      requestId,
    });
  });

  it("drops the request ID of an unexpected response when it is not a UUID", async () => {
    const result = await sendStatusRequest("proxy-error", {
      "x-echo-request-id": "not-a-uuid",
    });

    expect(result).toEqual({
      kind: "unexpected-response",
      status: BAD_GATEWAY,
      requestId: null,
    });
  });

  it("throws when a success response violates its route contract", async () => {
    await expect(sendStatusRequest("contract-violation")).rejects.toThrow();
  });

  it("returns an unreachable result when the server cannot be reached", async () => {
    const closed = Bun.serve({ port: 0, fetch: () => new Response() });
    const closedUrl = closed.url.toString();
    await closed.stop(true);

    const result = await sendApiRequest({
      baseUrl: closedUrl,
      route: statusRoute,
      params: null,
      query: null,
      body: null,
      init: {},
    });

    expect(result.kind).toBe("unreachable");
  });
});
