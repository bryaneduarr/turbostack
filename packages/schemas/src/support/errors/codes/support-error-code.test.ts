import { describe, expect, it } from "bun:test";
import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import {
  API_SUPPORT_ERROR_CODE,
  SUPPORT_ERROR_CODE,
  SUPPORT_ERROR_CODE_DESCRIPTION,
} from "@workspace/schemas/support/errors/codes/support-error-code.constant";

const supportErrorCodes = Object.values(SUPPORT_ERROR_CODE);

describe("support error codes", () => {
  it("gives every code a unique AREA-NNN value", () => {
    expect(new Set(supportErrorCodes).size).toBe(supportErrorCodes.length);

    for (const code of supportErrorCodes) {
      expect(code).toMatch(/^(PAGE|API|NET)-\d{3}$/);
    }
  });

  it("describes every code with a nonempty sentence", () => {
    for (const code of supportErrorCodes) {
      expect(SUPPORT_ERROR_CODE_DESCRIPTION[code].trim()).not.toBe("");
    }
  });

  it("maps every server error name to an API code", () => {
    const serverErrorNames = errorResponseSchema.shape.error.shape.code.options;

    expect(Object.keys(API_SUPPORT_ERROR_CODE).sort()).toEqual(
      [...serverErrorNames].sort(),
    );
    expect(Object.keys(API_SUPPORT_ERROR_CODE)).toHaveLength(9);

    for (const code of Object.values(API_SUPPORT_ERROR_CODE)) {
      expect(code.startsWith("API-")).toBe(true);
    }
  });
});
