# Rules reviewer questions

One slice, changed lines only. Every finding is must-fix and names the rule it breaks.

## Skip: the verify run checks these by tool

Formatting, import order, file and folder names, placement, file length, folder size, alias imports, comment and suppression style, interface and schema field docs, route definitions, optional chaining, zero fallbacks, dependencies, unit test files, type errors, direct API requests, environment reads, hard-coded HTTP statuses, double type assertions, loose Zod schemas, manual memoization, and form event types.

## Questions

1. **Asked for:** Does each changed line do what `task.md` and the plan ask, and nothing more?
2. **Logic:** Are the edge cases right: empty, missing, null, first and last item, repeated action?
3. **Validation:** Is every input checked with the shared schema, in the browser before submitting and again on the server, and is the parsed value used afterwards?
4. **Owner:** Is each file in its deepest meaningful owner folder, with related existing files moved when the task created a better owner?
5. **Reuse:** Does it reuse the existing helper, component, class map, or constant instead of copying one?
6. **Server and client:** Is `"use client"` as low as possible, are mutations Server Actions, is server data fetched in Server Components, and is only the affected cache refreshed?
7. **Permissions:** Is permission checked on the server for every action, with the missing-permission and missing-resource behavior the rules give?
8. **Constants:** Do status values come from their constants?
9. **UI:** Only tokens and base components, layout-only classes in composites, one primary button per view, labels on icon-only controls, works from 150px wide?
10. **Names and comments:** Do names say what things are, and do comments say only what the code cannot?
11. **Absence:** Is every optional or nullable value optional for a real reason, narrowed before use, and never replaced by a made-up default?
12. **Scenarios:** Does the browser scenario prove its Done when line, create its own data, use the shared session helper when signing in is only setup, and never wait on the real clock?
