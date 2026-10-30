# Choose the tool

| Need | Use | Why |
| --- | --- | --- |
| Test or debug this app with clean state | `chrome-isolated` MCP | Empty profile per session, deleted at the end, no stored logins to leak |
| Site that needs the user's own login | `chrome` MCP (instance `default`) | Profile keeps the sessions; the user signs in once with `agent-chrome show default` |
| Many scripted steps, loops, or bulk extraction | `agent-browser --cdp "$(agent-chrome port NAME)"` from the shell | No tool-schema overhead; chain commands; load its guide first with `agent-browser skills get core` |
| Console, network, performance trace, Lighthouse, emulation, heap | Chrome DevTools tools of the MCP servers | Only they expose these |
| Confirm GPU or WebGL | `evaluate_script` reading `WEBGL_debug_renderer_info` (`UNMASKED_RENDERER_WEBGL`) | Names the graphics card the page really uses |
| Repeatable pass/fail evidence | Playwright suite ([verify-e2e](../../verify-e2e/SKILL.md)) | Only when the user asks for tests, not exploration |

Prefer the MCP tools for interactive work and the shell CLI for scripted work. Do not mix both on the same page at once.

## Check the setup

```sh
agent-chrome list            # instances, ports, state
agent-chrome status default  # running or stopped
```

If an instance is stopped, the MCP server starts it on first use. `agent-chrome help` lists every command.
