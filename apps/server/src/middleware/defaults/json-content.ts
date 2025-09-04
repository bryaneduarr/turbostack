import type { z } from "@hono/zod-openapi";

type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodObject>;

export function jsonContent<T extends ZodSchema>(
  schema: T,
  description: string,
) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}
