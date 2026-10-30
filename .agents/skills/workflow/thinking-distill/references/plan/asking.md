# Asking

Questions clear the `user` doubts. Print them in chat as plain text, never through a question tool, and wait for the answer.

## Rounds

- Each round holds a small batch, usually 2 to 5 questions, whose answers cannot change each other. A question that depends on another answer waits for the next round.
- Ask the most foundational doubts first, those whose answers reshape the most other doubts, so the plan needs as few rounds as possible. Before printing a round, finish every piece of work its answers do not change, such as scouting and the flow draft, so the user's reading time is never also the agent's waiting time.
- After each answer, update the doubts list, then rewrite the next round: drop questions the answer settled, reword the rest, and change their recommendations to fit what the user said.
- Follow up on a vague answer. Challenge an answer that conflicts with the goal, an earlier answer, a rule, or a lesson, saying what conflicts and what it would cost.
- There is no limit on questions or rounds. Stop only when every doubt has ended.
- The user may answer `all recommended`, or answer only some; unanswered questions stay open for the next round.

## Never ask

Coding rules, file names, folders, test tools, the environment, commit style, libraries or components the project already has, and anything a lesson answers. Decide those ([understand](understand.md#decide-for-the-user)).

## Ask

Where the data comes from; outside services and their cost; who may do what; what people see; what happens at the end of the process and how to soften its side effects; failure and worst cases that need a product choice; actions that cannot be undone; privacy and retention; and scope trade-offs. Examples: "Where do we get the list of members?", "Do you want to store this in the database or keep it only in the session?", "At the end, every other device is signed out. How should we soften that?".

## Question format

```markdown
**<n>. <Topic>.** <The question, about 20 words or fewer.>
Why it matters: <one line tying the answer to the goal>.
New idea: <term>: <what it is, with an everyday comparison>. (Only when the question uses a new idea.)
- A. <option> **(Recommended)**: <what it brings and what it costs, with a small example>. Why: <the reason it is recommended>.
- B. <option>: <what it brings and what it costs, with a small example>.
```

- One decision per question, 2 to 4 options, the recommended one first with its reason. The user can always answer in their own words; do not add an "Other" option.
- Write for a reader with no background in the topic. A reader new to a programming language, a database, or a protocol must still be able to choose: explain the idea, then show what each option means for them.
- Skip choices with one sensible answer; for an assumption, ask one yes or no question instead.

## Success/failure check

When only the user can say whether something was right (taste, fit for their need, whether an earlier delivery did what they wanted), ask one question labelled **Success/failure check**, say that the answer becomes a lesson, and record it ([proof and lessons](../learn/proof-and-lessons.md)). Ask open checks from an earlier delivery's `outcomes.md` in the first round.

## The team round

The last round names the delivery team, so the prompt is complete:

- A subagent (model and reasoning) for each job kind: orchestrator, setup, implement, publish, review (rules, plan, reliability), review (security), fix, verify, record, advise. Recommend the [brain and hands](../team/brain-and-hands.md) table from the models the session can see: the brain (Opus 5.5) only for the security audit and advise, the hands (Haiku 5.5) for everything else, with the reason and its effect on the 5-hour usage window.
- Agents at once, from the [split rules](../prepare/split-rules.md#agents-at-once), with the reason.
- Whether the delivery harness can start subagents in the background (rolling start) or waits for each batch ([scheduling](../team/scheduling.md)); decide it from the harness, never ask.
