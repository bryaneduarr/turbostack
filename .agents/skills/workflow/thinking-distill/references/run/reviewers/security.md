# Security auditor questions

The whole change. The question behind every item: can anyone reach what they should not, skip what they must not, or find what should stay secret? Must-fix when it can leak data or let someone past a permission or a step; otherwise should-fix.

## Access

1. Does every server entry point (route, Server Action, job) check sign-in and permission on the server, not only by hiding a button?
2. Can changing an id in a URL, form, or request body reach another person's or organization's data?
3. Can someone skip a step, such as verification or confirmation, by calling a later step directly?
4. Are sessions, codes, and tokens random, single-use where they should be, quick to expire, and ended when they should be?

## Input

5. Is every value checked strictly on the server, with unknown fields removed or rejected? Are uploads limited by type and size?
6. Is there raw SQL built from input, HTML injected into the page, a redirect to a URL from input, or a server request to a URL a person supplied?
7. Can it be spammed (emails, uploads, costly calls), and is there a rate limit?

## Leftovers and leaks

8. **Settings:** is every new environment variable declared in its environment schema, in each `.env.example`, in the devcontainer stack, in CI and deploy docs where the project has them, and does a missing value stop startup instead of failing silently?
9. Is a server-only value kept out of the browser bundle, with no public prefix on a secret?
10. Can a response, an error page, or a log line show a secret, token, password, email, internal id, or stack trace?
11. Is there a secret, real email, or real personal data in code, scenarios, fixtures, or commits?
12. Is every new package maintained, free of known issues, on an allowed license, and added to the workspace that owns it?
