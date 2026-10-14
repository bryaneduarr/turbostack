import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import {
  CONFLICT,
  NOT_FOUND,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { describe, expect, it } from "vitest";
import app from "@/application.module";
import { createApp } from "@/config/http/application/http-application.config";
import { ExpectedFailure } from "@/services/responses/errors/expected-failure.error";

describe("global error handling", () => {
  it("returns a NOT_FOUND envelope for unknown routes", async () => {
    const response = await app.handle(new Request("http://localhost/missing"));
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(NOT_FOUND);
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("returns the code and specific message of an expected failure", async () => {
    const conflictApp = createApp().post("/profiles", () => {
      throw new ExpectedFailure({
        code: "CONFLICT",
        message: "A profile with this name already exists.",
      });
    });

    const response = await conflictApp.handle(
      new Request("http://localhost/profiles", { method: "POST" }),
    );
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(CONFLICT);
    expect(body.error.code).toBe("CONFLICT");
    expect(body.message).toBe("A profile with this name already exists.");
  });
});
