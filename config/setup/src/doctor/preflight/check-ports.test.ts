import { describe, expect, it } from "bun:test";
import { isOwnedByRunningService } from "@workspace/setup/doctor/preflight/check-ports.service";
import type { PortClaim } from "@workspace/setup/types/doctor/preflight/port-claim.interface";

const databaseClaim: PortClaim = {
  port: 5432,
  service: "PostgreSQL",
  composeService: "postgres",
};

const clientClaim: PortClaim = { port: 3000, service: "web client" };

describe("isOwnedByRunningService", () => {
  it("accepts a busy port whose compose service runs in this project", () => {
    expect(isOwnedByRunningService(databaseClaim, ["postgres"])).toBe(true);
  });

  it("rejects a busy port whose compose service is not running", () => {
    expect(isOwnedByRunningService(databaseClaim, [])).toBe(false);
  });

  it("rejects an app port that no compose service publishes", () => {
    expect(isOwnedByRunningService(clientClaim, ["postgres"])).toBe(false);
  });
});
