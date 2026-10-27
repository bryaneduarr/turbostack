import { describe, expect, it } from "bun:test";
import { isSupportedBunVersion } from "@workspace/setup/doctor/preflight/check-toolchain.service";

describe("isSupportedBunVersion", () => {
  it("accepts the pinned version and its later patch releases", () => {
    expect(isSupportedBunVersion("1.4.0", "1.4.0")).toBe(true);
    expect(isSupportedBunVersion("1.4.2", "1.4.0")).toBe(true);
  });

  it("rejects older patches and other minor or major releases", () => {
    expect(isSupportedBunVersion("1.4.0", "1.4.1")).toBe(false);
    expect(isSupportedBunVersion("1.5.0", "1.4.0")).toBe(false);
    expect(isSupportedBunVersion("2.4.0", "1.4.0")).toBe(false);
  });
});
