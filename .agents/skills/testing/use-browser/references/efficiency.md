# Work efficiently

Cost comes from tool calls and returned text. Spend neither on what you can read once or filter.

## Read the page

- Use `take_snapshot` (text accessibility tree with element ids) to see the page. Take a screenshot only when appearance is the question, and then use `uid` for one element, `format: "jpeg"` with a `quality`, and `filePath` so the image stays out of the context.
- Pass `filePath` to `take_snapshot` for large pages and read only the part you need.
- Use `evaluate_script` to return exactly the data wanted (a count, a text, a computed style) instead of snapshotting to find it.

## Act

- Use `fill_form` for several fields in one call.
- Wait with `wait_for` on expected text, never fixed sleeps. Pass several alternatives in its `text` array when the outcome varies, such as success and error messages.
- After navigation or an action, take one new snapshot; ids from an older snapshot go stale.
- Every tool needs a `pageId`. Keep one working page, `close_page` the rest, and open new tabs with `new_page`.

## Inspect problems

- `list_console_messages` with `types` (`error`, `warn`) and a small `pageSize`; fetch one entry with `get_console_message`.
- `list_network_requests` with `resourceTypes` (`fetch`, `xhr`, `document`) and a small `pageSize`; fetch one request with `get_network_request`.
- Check both after each flow step, not at the end.
- `emulate` for dark mode, reduced motion, mobile viewport, or slow network; each call replaces all emulation, so pass the full set. Reset it when done.
- `performance_start_trace` (reload on) then `performance_analyze_insight` for one insight at a time; `lighthouse_audit` for accessibility and SEO.

## Skip the browser when a cheaper source exists

- Seeded data: [development commands](../../../../project-context/development/commands.md).
- Backend behavior: call the API with `curl`; use the browser only for what the page renders or runs.
