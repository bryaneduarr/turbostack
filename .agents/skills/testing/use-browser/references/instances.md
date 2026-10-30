# Instances and isolation

Each instance has its own profile folder and loopback debug port. Chrome runs headed with the GPU on.

| Goal | How |
| --- | --- |
| Throwaway browser | `chrome-isolated` MCP, or `AGENT_CHROME_INSTANCE=ephemeral`; deleted when the session ends or the wrapper dies |
| Throwaway browser that starts with the user's logins | Add `AGENT_CHROME_CLONE_FROM=default`; only with the user's consent |
| Named persistent browser | `agent-chrome start <name>`; `agent-chrome stop <name> --purge` deletes it |
| Separate cookies inside one browser | `new_page` with `isolatedContext: "<label>"`; lighter than a new instance, same browser process |
| Show the browser to the user | `agent-chrome show <name> [URL]` |

## Rules

- Use one instance per task; never share tabs between instances.
- Name instances after the task, such as `profile-check`.
- Instances started by the MCP servers have no window until a page opens.
- Stop what you started: `agent-chrome stop <name>`; `agent-chrome stop --all` only when the user owns nothing else running.
- Do not edit the `default` profile folder by hand or point a debug port at the user's normal Chrome profile; Chrome ignores it.
