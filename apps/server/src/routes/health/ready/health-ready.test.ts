import { describe, expect, it } from "bun:test";
import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import { SERVICE_UNAVAILABLE } from "@workspace/utils/http/status-codes/http-status-code.constant";
import app from "@/application.module";
import { startServerDraining } from "@/services/server/lifecycle/server-draining-state.service";

describe("GET /health/ready", () => {
  it("fails readiness without querying the database once the server drains", async () => {
    startServerDraining();

    const response = await app.handle(
      new Request("http://localhost/health/ready"),
    );
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(SERVICE_UNAVAILABLE);
    expect(body.error.code).toBe("SERVICE_UNAVAILABLE");
    expect(body.message).toBe("Server is shutting down.");
  });
});
