# @workspace/ui

Our own React components for the workspace, built on native HTML elements and the
shared [Tailwind CSS](https://tailwindcss.com/) tokens. The package depends only on
React, so there is no UI library to upgrade or work around.

## Structure

```text
src/
├── components/
│   ├── button/
│   │   └── button.component.tsx
│   └── text-field/
│       └── text-field.component.tsx
├── types/
│   └── components/
│       ├── button/
│       │   └── button-props.interface.ts
│       └── text-field/
│           └── text-field-props.interface.ts
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
`ButtonLink` takes the same `variant` and `size` for navigation that should look
like a button.
`variant` (`primary`, `secondary`, `outline`, `ghost`, `destructive`), `size`
(`small`, `medium`, `large`), and `type` are required, so every use states its
look and its form behavior. `className` is appended for layout; it does not merge
or override the variant classes.

```tsx
import { TextField } from "@workspace/ui/components/text-field/text-field.component";

<TextField
  label="First name"
  name="firstName"
  type="text"
  defaultValue={values.firstName}
  errors={fieldErrors.firstName}
/>;
```

`TextField` renders a visible label, a native `<input>`, and its validation
messages. `label`, `name`, `type`, and `errors` are required; pass an empty
`errors` list when the value is valid. Invalid fields set `aria-invalid` and link
their messages with `aria-describedby`.

## Base and Composite Components

The package has two kinds of components, described in the
[UI and styling rules](../../.agents/rules/ui-and-styling.md):

- **Base components** (typography, links, buttons, fields, layout, feedback,
  data display, navigation) are the only code that applies visual classes to
  native elements.
- **Composite components** (forms, pickers, menus, dashboards) combine base
  components with data and actions. They use layout utilities only, whether they
  live here or in an app.

## Adding a Component

1. Look for an existing base component first. Add a variant to it rather than
   creating a near-duplicate.
2. Create `src/types/components/<group>/<component>-props.interface.ts` with a
   documented props interface. Make every prop the component needs required.
3. Create `src/components/<group>/<component>/<component>.component.tsx`.
   - **Composite:** build only from base components and layout utilities.
   - **Base:** use native elements, keep variant class maps in the component, and
     check them with `satisfies Record<Props["variant"], string>`.
4. Style base components only with the design tokens and motion utilities from
   `@workspace/tailwind` (`bg-primary`, `text-muted-foreground`, `shadow-lg`,
   `ease-spring`, `pressable`, `lift`, `animate-rise-in`, and so on). When a new
   component resembles an existing one, import its class map from `src/config/`
   instead of copying classes.
5. Add `"use client"` only when the component itself uses state, effects, or
   browser APIs. Components such as `Button` that only forward event handlers work
   in both Server and Client Components.

Build components in-house; do not install or copy third-party component code.
Add a dependency only when a component needs behavior that is hard to build
correctly, such as complex focus management, and record why in this README.

## Scripts

- **bun run check-types** - Check TypeScript types without emitting files
- **bun run clean** - Remove generated directories (node_modules, .turbo)
- **bun run format** - Format code with Biome
- **bun run lint** - Lint code with Biome
