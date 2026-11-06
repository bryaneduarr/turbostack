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

- Prefer native Next.js features to custom infrastructure: `loading.tsx`, `error.tsx`, `not-found.tsx`, `forbidden.tsx`, Suspense, Server Actions, Route Handlers, and the Metadata API.
- A missing permission calls `forbidden()` from `next/navigation`, which renders `forbidden.tsx` and needs `experimental.authInterrupts` in `next.config.ts`. A missing resource or no membership calls `notFound()`.
- Use `next/link` for internal application navigation when appropriate.
- Only fetched data may wait; titles, section headings, fixed text, and data-free controls render at once. Split such a page into:
  - a frame component that holds the fixed parts and takes each data part as a slot;
  - the page, which fills each slot with `<Suspense fallback={<Skeleton />}>` around an async loader component, so each part streams on its own;
  - the section's own `loading.tsx`, which renders the same frame with `Skeleton` slots, so a prefetched click shows the real titles before the server answers.
- A `loading.tsx` also covers every child segment below it, so a parent's index page that has child sections keeps its page and `loading.tsx` in a route group, such as `settings/(profile)/`; otherwise opening a child section first flashes the index page's skeleton.
- A loading placeholder copies its content's final layout, never a generic box: draw each element as a `Skeleton` of the same kind and size (a text line, field, button, avatar, icon tile, icon, or badge). Keep only text outside the data as real text, such as section titles, field labels, and help text. Inside data rows, such as list items and their description lists, draw the icons and terms as skeletons too, and draw lists with one row per `LIST_SKELETON_ROW_KEYS` entry (five). Put it in a `<name>-skeleton.component.tsx` beside the loader or component it mirrors, and use it in both the `Suspense` fallback and `loading.tsx`, so nothing moves when the data arrives.
- A dialog or panel that switches sections also receives each section's `loading.tsx` view and shows it the moment a section is clicked, so the content changes with the navigation highlight even before a prefetch finishes or in the dev server, which does not prefetch. A link that opens such a dialog from outside it draws the dialog the same way at click time, through a provider above the root template.
- Links between such sections prefetch on intent with `router.prefetch` on pointer enter and focus, never on render, because rendered prefetch loads every link's page and slows the server. A click marks its link current at once.
- Loaders that share one API read on a page wrap it in React `cache()` so it runs once per request.
- Use `next/image` when its optimization benefits the image source and use case, not mechanically.

## Mutations and caching

- Use Server Actions for mutations that naturally belong to UI forms or button-triggered actions.
- Keep validation, authorization, business logic, and sensitive operations on the server.
- Also validate form values in the browser before submitting, as required by `types-and-validation.md`; this never replaces server validation.
- Validate user-controlled mutation values even when invoked through a Server Action.
- Introduce caching only when what is cached, its lifetime, refresh behavior, and mutation invalidation are understood.
- After a mutation, invalidate or update only affected cached data using appropriate Next.js APIs.
- Do not refresh unrelated pages or the entire application unnecessarily.
