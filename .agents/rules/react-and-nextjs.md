# React and Next.js

These rules are mandatory. Follow React 19 and Next.js 16 conventions.

## React

- Prefer simple functions, expressions, and variables.
- Rely on React Compiler for ordinary memoization.
- Do not add `useMemo`, `useCallback`, or `React.memo` by default.
- Manual memoization requires a demonstrated reason, such as an external API's stable-reference contract or a measured performance problem.
- Do not mechanically introduce `"use memo"` directives.
- Memoization advice from skills, tutorials, or other imported guidance does not override these conventions.

## Server and client boundaries

- Use Server Components by default.
- Add `"use client"` only when browser APIs, state, effects, event handlers, or client-only libraries require it.
- Keep client boundaries as low in the component tree as practical.
- Fetch server data directly in Server Components when possible. Avoid unnecessary client requests for data already available on the server.
- Run independent asynchronous server operations concurrently with `Promise.all` when appropriate.

## Native framework features

- Prefer native Next.js features to custom infrastructure: `loading.tsx`, `error.tsx`, `not-found.tsx`, Suspense, Server Actions, Route Handlers, and the Metadata API.
- Use `next/link` for internal application navigation when appropriate.
- Use `next/image` when its optimization benefits the image source and use case, not mechanically.

## Mutations and caching

- Use Server Actions for mutations that naturally belong to UI forms or button-triggered actions.
- Keep validation, authorization, business logic, and sensitive operations on the server.
- Also validate form values in the browser before submitting, as required by `types-and-validation.md`; this never replaces server validation.
- Validate user-controlled mutation values even when invoked through a Server Action.
- Introduce caching only when what is cached, its lifetime, refresh behavior, and mutation invalidation are understood.
- After a mutation, invalidate or update only affected cached data using appropriate Next.js APIs.
- Do not refresh unrelated pages or the entire application unnecessarily.
