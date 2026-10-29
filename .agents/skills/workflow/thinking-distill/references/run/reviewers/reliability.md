# Reliability auditor questions

The whole change. The question behind every item: would this survive heavy internet traffic, and could a person or an agent run it in production, notice a problem, and limit the damage? Must-fix when it can lose data, break under normal traffic, or leave production unable to see or undo it; otherwise should-fix.

## Load

1. How many database queries does one request make, and does that number grow with the size of a list (one query per item)?
2. Is every list limited or paged? Is every new filter, sort, or join column indexed?
3. At 100 times today's traffic, what slows down first, and what is the remedy: a limit, an index, a cache, or a queue?
4. Does every call to an outside service (email, storage, HTTP) have a time limit, and what does the person see when that service is down?

## Safety under repeats

5. Do a double click, a retry, and a reloaded form give the same result as one click?
6. Can two people or two requests change the same row at once, and who wins?
7. Are writes that must all happen together inside one transaction?
8. Can a background job run twice or crash halfway without leaving broken data?

## Running it in production

9. When it fails, which log line, audit event, or error code tells a person or an agent what happened, without leaking personal data?
10. Can it be turned off or rolled back: do database changes only add, avoid long locks on live tables, and keep older clients working?
11. Does every error message tell the person what to do next?
12. Are new limits, timeouts, and retry counts named constants or settings someone can find and change, not hidden numbers?
