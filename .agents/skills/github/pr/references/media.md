# Pull request media

GitHub's command line cannot attach files to a pull request, so screenshots and videos go to a long-lived branch named `pr-media` through the API, and the body links them. The files never enter the feature branch or `main`, and the `pr-media` branch is the one branch that stays after cleanup.

## When

A feature with visible behavior (a screen, a form, an email, a flow) gets media. A feature with nothing to see (a refactor, a server-only change) gets none; say so in the `Checked` section.

## Record

Run the app with the [dev-server skill](../../../workflow/dev-server/SKILL.md) and capture the feature with `agent-browser`, following the [browser-smoke-test skill](../../../testing/browser-smoke-test/SKILL.md). Save under `~/projects-media/<project>/<feature>/screenshots` and `.../videos`. Take as many screenshots as the reader needs: every new state, error, and screen, in light and dark when the look changed. Convert each video to a small MP4:

```bash
ffmpeg -y -i demo.webm -c:v libx264 -pix_fmt yuv420p -crf 30 -movflags +faststart demo.mp4
```

## Upload

```bash
repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
feature="<feature-slug>"
media=~/projects-media/<project>/$feature

# Create the pr-media branch once, with no history shared with main.
if ! gh api "repos/$repo/branches/pr-media" >/dev/null 2>&1; then
  tree="$(gh api "repos/$repo/git/trees" -f 'tree[][path]=README.md' -f 'tree[][mode]=100644' -f 'tree[][type]=blob' -f 'tree[][content]=Screenshots and videos for pull requests.' -q .sha)"
  commit="$(gh api "repos/$repo/git/commits" -f message='chore: start pr-media' -f tree="$tree" -q .sha)"
  gh api "repos/$repo/git/refs" -f ref=refs/heads/pr-media -f sha="$commit"
fi

# Upload every file; --input avoids the argument size limit on videos.
find "$media" -type f \( -name '*.png' -o -name '*.mp4' \) | while read -r file; do
  path="$feature/$(basename "$file")"
  sha="$(gh api "repos/$repo/contents/$path?ref=pr-media" -q .sha 2>/dev/null || true)"
  jq -n --arg m "media: $feature" --arg b pr-media --arg s "$sha" --rawfile c <(base64 -w0 "$file") \
    '{message:$m,branch:$b,content:$c} + (if $s == "" then {} else {sha:$s} end)' |
    gh api -X PUT "repos/$repo/contents/$path" --input - >/dev/null
done
```

Each file is then at `https://github.com/<repo>/blob/pr-media/<feature>/<name>`.

## Link in the body

In the optional `## Preview` section of the pull request body:

- Screenshot: `![what it shows](https://github.com/<repo>/blob/pr-media/<feature>/<name>.png?raw=true)`.
- Video: `[Watch: what it shows](https://github.com/<repo>/blob/pr-media/<feature>/<name>.mp4)`, which opens GitHub's video player.

Viewers with access to the repository see the media, including in a private repository. Put one line of text above each item saying what to look at.
