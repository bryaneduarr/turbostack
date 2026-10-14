# Web Client

A [Next.js](https://nextjs.org) 16 App Router application using React 19, the
shared [Tailwind CSS](https://tailwindcss.com/) theme, and components from
`@workspace/ui`. The package is named `web-client`.

## Getting Started

```sh
cp apps/client/.env.example apps/client/.env
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page calls the API's
`GET /health/ready` from a Server Component and shows whether the API and its
database are ready. [/profiles](http://localhost:3000/profiles) lists, creates,
and edits user profiles, the reference feature.

## Calling the API

Server Components, Server Actions, and Route Handlers call the API with
[`requestApi`](./src/services/api/requests/request-api.service.ts). It wraps
`sendApiRequest` from `@workspace/api-client` with the validated `SERVER_URL`,
`cache: "no-store"`, and a five-second timeout, so callers pass only the route
definition and its `params`, `query`, and `body`. Pages that call it start with
`await connection()` so Next.js renders them per request instead of at build
time. [`describeApiFailure`](./src/services/api/results/describe-api-failure.service.ts)
turns every unsuccessful result into a message for users.

## Forms and Server Actions

The profile forms show the pattern for mutations:

1. A Client Component form
   ([`user-profile-form.component.tsx`](./src/components/users/profiles/form/user-profile-form.component.tsx))
   submits through `useActionState`, so it also works without JavaScript.
2. The Server Action
   ([`actions/users/profiles/`](./src/actions/users/profiles/)) validates the
   form data with the shared schema, validates bound arguments such as the
   profile ID, calls the API through `requestApi`, and returns a form state:
   `editing`, `invalid` with field messages, `failed`, or `saved`.
3. After a change, the action calls `revalidatePath` only for the pages that show
   the changed profile.

Form states keep the values that were typed, so a failed submission does not
clear the form.

## Environment

| Variable | Purpose |
|---|---|
| `SERVER_URL` | API server base URL, used by the client's server; never sent to the browser |

[`client-env.config.ts`](./src/config/environment/client-env.config.ts) validates
it with the shared `clientEnvSchema` at request time, and
[`instrumentation.ts`](./src/instrumentation.ts) validates it when the server
starts, so a missing value fails fast. Because it is read at runtime rather than
inlined at build time, one build or Docker image works in every environment. Call
the API from Server Components, Server Actions, or Route Handlers; add a
`NEXT_PUBLIC_` variable only if the browser must call the API directly.

## Production

`bun run build` creates a [standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
server in `.next/standalone` and copies the static assets into it. `bun run start`
runs it with Node.js and loads `apps/client/.env` when present.

The [Dockerfile](./Dockerfile) builds the same output from the repository root and
runs it on Node.js's slim image as the unprivileged `node` user:

```sh
docker build -f apps/client/Dockerfile -t web-client .
docker run --rm -e SERVER_URL=http://host.docker.internal:3001 -p 3000:3000 web-client
```

## Scripts

- **bun run build** - Build the standalone production server
- **bun run check-types** - Check TypeScript types without emitting files
- **bun run clean** - Remove node_modules, .turbo, and .next
- **bun run dev** - Start the development server with Turbopack
- **bun run format** - Format code with Biome
- **bun run lint** - Lint code with Biome
- **bun run start** - Run the standalone production server
