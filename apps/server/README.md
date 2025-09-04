# Hono TypeScript Server

A type-safe **Back-End** server application built with **Hono** and **TypeScript**.

This server provides a maintainable services with modern TypeScript, OpenAPI documentation.

## Features

- **TypeScript Integration**: Full type safety throughout the application.
- **Hono Framework**: Fast, modern, and lightweight web framework.
- **OpenAPI Integration**: Auto-generated OpenAPI docs for your API.
- **Environment Configuration**: Type-safe, Zod-validated environment variable management.

## Getting Started

Create a `.env` file based on the [.env.example](./.env.example) template:

```sh
cp .env.example .env
```

## Development

Start the development server:

```sh
pnpm run dev
```

The server will be available at [http://localhost:3001](http://localhost:3001) by default.

## Production

Build the TypeScript project:

```sh
pnpm run build
```

The compiled JavaScript will be generated in the `dist/` directory.

Starting the Production Server:

```sh
pnpm run start
```

## Available Scripts

- **pnpm build** - Compile TypeScript to JavaScript with path alias resolution
- **pnpm check-types** - Check TypeScript types without emitting files
- **pnpm clean** - Remove generated directories (dist, node_modules, .turbo)
- **pnpm dev** - Start development server with hot reloading
- **pnpm format** - Format code with Prettier
- **pnpm lint** - Lint code with ESLint
- **pnpm start** - Start the production server
- **pnpm update** - Update dependencies to their latest versions

## Environment Configuration

The application uses a type-safe configuration module to manage environment variables, validated with Zod. See [src/env.ts](./src/env.ts) to add more ENV variable with type-safety.

```typescript
const EnvSchema = z.object({
  SERVER_URL: z.url().describe("The base URL for the server."),
  // Add more env variables here as zod schema.
});
```

**If any required variable is missing or invalid, the server will throw an error on startup.**

## OpenAPI Integration

The server is configured to generate OpenAPI documentation automatically using `@hono/zod-openapi`.

You can find the OpenAPI config in [src/config/openapi-config.ts](./src/config/openapi-config.ts).

All routes and schemas are documented and available at the `/reference` endpoint. This is built in with [Scalar](https://github.com/scalar/scalar).

## Adding a New Route

Routes follow a modular structure for maintainability and type safety. Each route consists of:

- A **handler** (business logic).
- A **route** (Hono route definition).
- The **routes index** (exports all routes).

To add a new route:

1. **Create a handler** in `src/routes/handler.my-feature.ts`:

```typescript
// src/routes/handler.my-feature.ts
import { Context } from "hono";

export const myFeatureHandler = (c: Context) => {
  return c.json({ message: "Hello from my feature!" });
};
```

2. **Create a route** in `src/routes/route.my-feature.ts`:

```typescript
// src/routes/route.my-feature.ts

import { INTERNAL_SERVER_ERROR, OK } from "@/utils/http-status-codes";

// Take a full example of how this hello world route is built in 'apps/server/src/routes/route.hello-world.ts'.
export const helloWorldRoute = createRoute({
  path: "/hello-world",
  method: "get",
  tags: ["Hello World"],
  summary: "Say Hello, World!",
  description: "Respond with a hello world to check if the route is working.",
  // Here is where all of your responses will go.
  // It is recommended to use the "http-status-codes" for easy reading.
  responses: {
    [OK]: ok, // The 'ok' references how the response will be built.
    [INTERNAL_SERVER_ERROR]: internalServerError,
  },
});
```

3. **Export the route** in `src/routes/index.ts`:

```typescript
import { createRouter } from "@/config/create-router";

import { helloWorldHandler } from "./handler.hello-world";
import { helloWorldRoute } from "./route.hello-world";

// In here specify all the routes that you want to expose in the OpenAPI documentation with their handlers.
// First is the route and then the handler.
// To add more routes in here just create new ones `.openapi(route, handler).openapi(route, handler)`.
const router = createRouter().openapi(helloWorldRoute, helloWorldHandler);

export default router;
```

4. **Register the route in the app** in `src/app.ts`, just place the index file of the imported routes in here.:

```typescript
// src/app.ts
import helloWorld from "./routes/index";

// Define all the index routes in here and it will import all of the routes you defined in there.
const routes = [helloWorld];
```

Your new route will now be available at `/api/my-feature` and **automatically included in the OpenAPI docs based on the documentation you specified in the routes file**.

## TypeScript Path Aliases

The project is configured with TypeScript path aliases for cleaner imports:

`@/*` - Resolves to the [./src](./src/) directory

Example usage:

```typescript
import env from "@/env";
```
