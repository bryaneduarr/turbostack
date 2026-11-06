---
name: browser-smoke-test
description: "Prove the browser tool works by itself: open a page, click, take screenshots, record a video, check the files, and tell the user where they are. Use before relying on the browser for a task, when a browser command fails or behaves oddly, and whenever the user asks whether the browser works."
---

# Browser smoke test

Shows in about 30 seconds that `agent-browser` starts, drives a page, takes screenshots, and records a video, so a later failure is the app's, not the tool's.

## Output

- As many screenshots as best show the user what happened, you decide in the moment (one for a simple page, many for a long flow), plus one video, saved under `~/projects-media/<project>/<feature>/` (`screenshots/` and `videos/`). `<project>` is the repository folder name; `<feature>` is the branch or work tree name, or `browser-check` for a plain tool test. Never save media inside the repository.
- A table in the report with the absolute path of every file, one per row, never shortened, so the user can open each one from the terminal.

## Steps

Load the [agent-browser skill](../agent-browser/SKILL.md) first and follow its `skills get core` guide. Use your own session name for every command.

1. Pick the page: the project's own dev server when it runs ([dev-server skill](../../workflow/dev-server/SKILL.md)), otherwise `https://example.com`.
2. Create the folders and set the names:

   ```bash
   media=~/projects-media/<project>/<feature>
   mkdir -p "$media/screenshots" "$media/videos"
   session="$(agent-browser session id --scope worktree --prefix smoke)"
   ```

3. Open the page, start the recording, and look at it:

   ```bash
   agent-browser --session "$session" open <url>
   agent-browser --session "$session" record start "$media/videos/smoke.webm" --cursor
   agent-browser --session "$session" snapshot -i
   agent-browser --session "$session" screenshot "$media/screenshots/01-start.png"
   ```

4. Click one link or button from the snapshot, wait for the result with a text or URL wait, confirm the new URL or text, and take `02-after-click.png`. Take further screenshots wherever they add information, such as each state, error, or page the flow passes; there is no limit.
5. Stop and close:

   ```bash
   agent-browser --session "$session" record stop
   agent-browser --session "$session" close
   ```

6. Verify the files, never assume: `ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$media/videos/smoke.webm"` must show a duration above zero, and read one screenshot to confirm it shows the expected page.

## When it fails

Fix it and run the test again until it passes: install the missing piece (`ffmpeg`, the browser binary), pick a shorter path, close a stuck session, or relaunch. Report a failure only when the machine lacks something you cannot obtain yourself, and name it.

## Report

State what was opened, what was clicked, the video length, and the table of absolute paths. Say plainly that it tested the browser tool, not the app, when the page was `example.com`.
