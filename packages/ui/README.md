# @workspace/ui

Our own React components for the workspace, built on native HTML elements and the
shared [Tailwind CSS](https://tailwindcss.com/) tokens. The package depends only on
React, so there is no UI library to upgrade or work around.

## Structure

```text
src/
├── components/
│   └── button/
│       └── button.component.tsx
├── types/
│   └── components/
│       └── button/
│           └── button-props.interface.ts
└── globals.css
```

## Using Components

Import each component directly from its module:

```tsx
import { Button } from "@workspace/ui/components/button/button.component";

<Button type="submit" variant="primary" size="medium">
  Save
</Button>;
```

`Button` renders a native `<button>` and accepts every native button attribute.
`variant` (`primary`, `secondary`, `outline`, `ghost`, `destructive`), `size`
(`small`, `medium`, `large`), and `type` are required, so every use states its
look and its form behavior. `className` is appended for layout; it does not merge
or override the variant classes.

## Adding a Component

1. Create `src/types/components/<component>/<component>-props.interface.ts` with a
   documented props interface. Make every prop the component needs required.
2. Create `src/components/<component>/<component>.component.tsx`. Use native
   elements, keep variant class maps in the component, and check them with
   `satisfies Record<Props["variant"], string>`.
3. Style with the theme tokens from `@workspace/tailwind` (`bg-primary`,
   `text-muted-foreground`, `border-border`, `ring-ring`, and so on).
4. Add `"use client"` only when the component itself uses state, effects, or
   browser APIs. Components such as `Button` that only forward event handlers work
   in both Server and Client Components.

Add a dependency only when a component needs behavior that is hard to build
correctly, such as complex focus management, and record why in this README.

## Scripts

- **bun run check-types** - Check TypeScript types without emitting files
- **bun run clean** - Remove generated directories (node_modules, .turbo)
- **bun run format** - Format code with Biome
- **bun run lint** - Lint code with Biome
