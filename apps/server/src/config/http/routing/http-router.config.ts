import { Elysia } from "elysia";
import { defaultErrorResponses } from "@/config/openapi/responses/errors/default-error-responses.config";

export function createRouter() {
  return new Elysia({ strictPath: true, nativeStaticResponse: false }).guard({
    detail: { responses: structuredClone(defaultErrorResponses) },
  });
}
