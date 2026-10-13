# @workspace/schemas

Shared Zod schemas for validation across the monorepo (server and client).

## Purpose

This package provides centralized schema definitions using Zod and `@hono/zod-openapi` for:

- **Type safety** across server and client
- **Consistent validation** logic
- **OpenAPI documentation** generation
- **Code reusability** and single source of truth

## Directory Structure

```text
src/
├── shared/          # Schemas used by both server and client
├── server/          # Server-only schemas (private)
└── client/          # Client-only schemas (private)
```

## Usage

### Import Shared Schemas

**In Server:**

```typescript
import { userSchema } from "@workspace/schemas/shared/user.schema";
```

**In Client:**

```typescript
import { userSchema } from "@workspace/schemas/shared/user.schema";
```

### Import Server-Only Schemas

```typescript
import { databaseUserSchema } from "@workspace/schemas/server/database-user.schema";
```

### Import Client-Only Schemas

```typescript
import { formStateSchema } from "@workspace/schemas/client/form-state.schema";
```

## Schema Naming Convention

- File naming: `{feature}.schema.ts`
- Export naming: `{feature}Schema` or `{specific}Schema`

**Examples:**

- `user.schema.ts` -> exports `userSchema`, `createUserSchema`, `updateUserSchema`
- `authentication/sign-in/sign-in.schema.ts` -> exports `signInSchema`
- `pagination.schema.ts` -> exports `paginationSchema`

## Creating Schemas

### Shared Schema Example

**File:** `src/shared/user.schema.ts`

```typescript
import { z } from "@hono/zod-openapi";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().toLowerCase(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export const createUserSchema = userSchema.omit({ id: true }).extend({
  password: z.string().min(8).max(128),
});

export const updateUserSchema = userSchema.partial().omit({ id: true });

// Export types for TypeScript
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
```

### Server-Only Schema Example

**File:** `src/server/database-user.schema.ts`

```typescript
import { z } from "@hono/zod-openapi";
import { userSchema } from "@workspace/schemas/shared/user.schema";

// Extended schema with server-only fields
export const databaseUserSchema = userSchema.extend({
  passwordHash: z.string(),
  salt: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DatabaseUser = z.infer<typeof databaseUserSchema>;
```

### Client-Only Schema Example

**File:** `src/client/form-state.schema.ts`

```typescript
import { z } from "@hono/zod-openapi";

export const formStateSchema = z.object({
  isSubmitting: z.boolean().default(false),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  touched: z.record(z.string(), z.boolean()).optional(),
});

export type FormState = z.infer<typeof formStateSchema>;
```

## OpenAPI Integration

Schemas in this package work seamlessly with Hono's OpenAPI integration:

```typescript
import { createRoute } from "@hono/zod-openapi";
import { userSchema } from "@workspace/schemas/shared/user.schema";
import { jsonContent } from "@/middleware/defaults/json-content";

const getUserRoute = createRoute({
  path: "/users/{id}",
  method: "get",
  responses: {
    200: jsonContent(userSchema, "User retrieved successfully"),
  },
});
```

## Best Practices

1. **Shared by Default**: If a schema is used by both server and client, place it in `shared/`
2. **Private When Needed**: Only use `server/` or `client/` for schemas with sensitive or environment-specific fields
3. **Compose Schemas**: Use `.extend()`, `.omit()`, `.pick()`, `.partial()` to build variations
4. **Export Types**: Always export TypeScript types using `z.infer<>`
5. **No Barrel Files**: Import directly from schema files, never create `index.ts` files
6. **Group Related Schemas**: Keep related schemas in the same file (e.g., `user.schema.ts` contains all user-related schemas)

## Examples

## Sign-In Credentials

[`sign-in.schema.ts`](./src/authentication/sign-in/sign-in.schema.ts) exports
`signInSchema`. It validates the email, normalizes it to lowercase, and requires a
nonempty password without transforming the password.
[`sign-in.interface.ts`](./src/authentication/sign-in/sign-in.interface.ts) exports
`ValidatedSignInCredentials`, derived from the schema's validated output.

```typescript
import type { ValidatedSignInCredentials } from "@workspace/schemas/authentication/sign-in/sign-in.interface";
import { signInSchema } from "@workspace/schemas/authentication/sign-in/sign-in.schema";

const input: unknown = {
  email: "example@example.com",
  password: "example-password",
};
const credentials: ValidatedSignInCredentials = signInSchema.parse(input);
```

Use `safeParse` and handle both outcomes for expected credential validation
failures. `parse` is appropriate when invalid data should throw.


### Pagination Schema

**File:** `src/shared/pagination.schema.ts`

```typescript
import { z } from "@hono/zod-openapi";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

export type Pagination = z.infer<typeof paginationSchema>;
```

## Common Patterns

### Email Schema

```typescript
export const emailSchema = z.email().toLowerCase();
```

### UUID Schema

```typescript
export const uuidSchema = z.uuid();
```

### Date Range Schema

```typescript
export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
```

### Response Schema

```typescript
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
    error: z.record(z.string(), z.array(z.string())).optional(),
  });
```
