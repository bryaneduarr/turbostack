# PR comments

The delivery reviews like a team on GitHub: every finding is a comment on the PR line it concerns, every fix replies with its commit, and the thread is then resolved. Run every command from the delivery worktree, so `gh` picks the repository and fills `{owner}` and `{repo}` itself.

## Comment on a line

The line must be part of the PR's diff. Use the head commit the brief gives.

```sh
gh api "repos/{owner}/{repo}/pulls/<number>/comments" \
  -f commit_id="<head sha>" -f path="<path>" -F line=<line> -f side=RIGHT \
  -f body="**must-fix · security** <what goes wrong, in plain words, with a small example>. Fix: <the change>." \
  --jq '.id, .html_url'
```

When the line is outside the diff, post a general comment that starts with `<path>:<line>`:

```sh
gh pr comment <number> --body "<path>:<line> **should-fix · reliability** <problem>. Fix: <change>."
```

Body format: severity (`must-fix` or `should-fix`) and reviewer mode in bold, the problem in plain words with a small example, and the fix.

## Reply and resolve

After the fix commit is pushed, reply to each line comment and resolve its thread:

```sh
gh api "repos/{owner}/{repo}/pulls/<number>/comments/<comment id>/replies" \
  -f body="Fixed in <sha>: <what changed, one line>."

gh api graphql -F n=<number> -f o="$(gh repo view --json owner --jq .owner.login)" \
  -f r="$(gh repo view --json name --jq .name)" -f query='
  query($o: String!, $r: String!, $n: Int!) {
    repository(owner: $o, name: $r) { pullRequest(number: $n) {
      reviewThreads(first: 100) { nodes { id isResolved comments(first: 1) { nodes { databaseId } } } }
    } }
  }' --jq '.data.repository.pullRequest.reviewThreads.nodes[]
    | select(.comments.nodes[0].databaseId == <comment id>) | .id'

gh api graphql -f id="<thread id>" -f query='
  mutation($id: ID!) { resolveReviewThread(input: { threadId: $id }) { thread { isResolved } } }'
```

A general comment has no thread: answer it with `gh pr comment <number> --body "Fixed in <sha> (re <comment URL>): <what changed>."`.

## Reply and resolve many

Fetch the threads once, then reply and resolve every fixed comment in one loop. Write one line per fixed line comment, `<comment id>|<sha>|<what changed>`, to `replies.txt`:

```sh
pr=<number>
o="$(gh repo view --json owner --jq .owner.login)"; r="$(gh repo view --json name --jq .name)"
gh api graphql -F n="$pr" -f o="$o" -f r="$r" -f query='
  query($o: String!, $r: String!, $n: Int!) {
    repository(owner: $o, name: $r) { pullRequest(number: $n) {
      reviewThreads(first: 100) { nodes { id isResolved comments(first: 1) { nodes { databaseId } } } }
    } }
  }' --jq '.data.repository.pullRequest.reviewThreads.nodes[]
    | select(.isResolved | not) | "\(.comments.nodes[0].databaseId) \(.id)"' > threads.txt
while IFS='|' read -r id sha text; do
  gh api "repos/{owner}/{repo}/pulls/$pr/comments/$id/replies" -f body="Fixed in $sha: $text." > /dev/null
  thread="$(awk -v id="$id" '$1 == id { print $2 }' threads.txt)"
  [ -n "$thread" ] && gh api graphql -f id="$thread" -f query='
    mutation($id: ID!) { resolveReviewThread(input: { threadId: $id }) { thread { isResolved } } }' > /dev/null
done < replies.txt
```

Then list the unresolved threads again and report any that remain.

## Rules

- Comments are short and factual. No praise, no AI or tool attribution.
- One finding per comment. Never post the same finding twice; check the open comments first with `gh api "repos/{owner}/{repo}/pulls/<number>/comments" --jq '.[] | [.id, .path, .line] | @tsv'`.
- A should-fix finding that is not fixed stays open and is listed in the PR body by the publish job in `ready` mode.
