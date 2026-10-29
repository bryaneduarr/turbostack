# Teaching

Every plan and every delivery report teaches the user something. The reader is smart but has no background in the topic and little time. The aim is the architectural view: how processes work and how services and data interact, not code.

## Teach each new idea

For every method, algorithm, pattern, protocol, or service the plan uses that the reader may not know:

- **What it is:** one plain sentence and an everyday comparison. "A rate limit is a ticket counter: after 5 tickets in an hour, the window closes until the hour ends."
- **How it works:** the method or algorithm in 3 to 6 numbered steps, with the data at each step. Pseudo-steps, never code.
- **The thinking:** the reasoning an engineer follows to reach for it: which problem shows up first, and why this answers it.
- **Why here:** what it solves in this feature, tied to the goal sentence.
- **When not:** when it is the wrong tool, what is used instead, and whether it is the usual recommendation.

Define every technical term on first use. Prefer one concrete example over two abstract sentences.

## Architecture tour

One picture of every service and store the feature touches (screen, server, database, worker, email, storage, outside service). Each arrow says what travels on it, who starts it, and what the person sees when it fails. Below the picture, one line per box: what it owns and why it exists. Name every detail that could be added at this level (a queue, a cache, an audit event, a retry), and say whether this plan uses it and why.

## In the plan session

`plan.md` holds the Learn section and the tour; the summary shows them in short form ([summary](../plan/summary.md)). A question that uses a new idea carries a `New idea:` line ([asking](../plan/asking.md)).

## In the delivery report

The final report adds **What you learned** under "We accomplished":

- How the main ideas were really built, with one tested example in plain words.
- What failed during delivery and why, as a lesson anyone could reuse.
- What the reviewers and auditors caught, and why it would have mattered in production.
