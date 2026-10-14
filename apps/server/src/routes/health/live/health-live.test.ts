import { healthLiveResponseSchema } from "@workspace/schemas/server/routes/health/live/health-live-response.schema";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { describe, expect, it } from "vitest";
import app from "@/application.module";

describe("GET /health/live", () => {
  it("returns the liveness envelope with a matching request ID", async () => {
    const response = await app.handle(
      new Request("http://localhost/health/live"),
    );
    const body = healthLiveResponseSchema.parse(await response.json());

    expect(response.status).toBe(OK);
    expect(body.data).toEqual({ status: "alive" });
    expect(response.headers.get("x-request-id")).toBe(body.requestId);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });
});
