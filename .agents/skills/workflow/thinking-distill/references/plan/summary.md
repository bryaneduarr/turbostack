# Summary

The approval summary is one screen the user can judge without background, and `plan.md` holds the same content in full. Everything sits in one place: every choice, edge case, and risk appears on the step of the flow it affects. Never say who decided what ("I chose", "you said"); present the result, so the user judges the plan itself.

## Contents, in order

1. **Goal:** the goal sentence.
2. **How it works:** a picture of the flow from the first action to the result. Each step names who acts and what data moves. Edge cases and choices sit on the step they affect, such as "double click: saves once, because the server ignores a repeat within 5 seconds".
3. **One example:** a fictional person walked through the whole flow, step by step, such as "Ana presses Resend, the server checks the last send time, Ana sees a 60 second countdown".
4. **Learn:** each new idea taught with [teaching](../learn/teaching.md): what it is, how it works, the thinking behind it, why here, and when it is not the right tool. Then the architecture tour: which services and data talk to each other.
5. **Scope:** Building, Not building, Later, one line each.
6. **Risks:** each risk, what softens it, and the sign we would see if it happened.
7. **Done when:** conditions anyone can check.
8. **Delivery at a glance:** the number of steps, the riskiest step, the expected minutes, and what the user does at the end. The steps are written before the summary, so these are real counts; show them again with the finish message.

## Visuals

Pick the medium automatically; never ask the user and never mention a missing tool.

- **HTML:** when a tool in this session can render HTML in the chat, build the summary as one self-contained page from `plan.md` and render it: inline CSS only, no scripts, fonts, or images from the network, readable in light and dark (`prefers-color-scheme`), boxes and arrows drawn with CSS or inline SVG. Save it as `summary.html` in the plan folder.
- **Text:** otherwise, draw the picture in chat with box-drawing characters, at most 80 columns, with a legend: `✓` works, `✗` fails, `◆` a choice, `⚠` an edge case.
- **Files:** `plan.md` draws its pictures in Mermaid with these colour classes:

```text
classDef person fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e
classDef ok fill:#dcfce7,stroke:#15803d,color:#14532d
classDef choice fill:#fef3c7,stroke:#b45309,color:#78350f
classDef fail fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d
classDef outside fill:#ede9fe,stroke:#6d28d9,color:#4c1d95
```

## In chat

The summary fits the report headings: the goal under "We are working on", the picture, example, learn, scope, risks, and Done when under "We accomplished", and the yes or no approval question under "You should do this next". Keep the chat version to about one screen plus the picture; `plan.md` holds the full text.
