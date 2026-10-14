# @workspace/tailwind

Shared [Tailwind CSS v4](https://tailwindcss.com/) configuration and theme tokens
for the workspace.

## Key Files

- **`globals.css`** - Tailwind import, theme tokens, dark mode, and base styles
- **`postcss.config.ts`** - PostCSS configuration for Tailwind

## Theme Tokens

`globals.css` defines CSS variables for light mode in `:root` and dark mode in
`.dark`, and maps them to Tailwind colors:

| Token | Utilities |
|---|---|
| `background`, `foreground` | `bg-background`, `text-foreground` |
| `primary`, `primary-foreground` | `bg-primary`, `text-primary-foreground` |
| `secondary`, `secondary-foreground` | `bg-secondary`, `text-secondary-foreground` |
| `muted`, `muted-foreground` | `bg-muted`, `text-muted-foreground` |
| `destructive`, `destructive-foreground` | `bg-destructive`, `text-destructive` |
| `success` | `text-success` |
| `border`, `ring` | `border-border`, `ring-ring` |
| `radius` | `rounded-sm`, `rounded-md`, `rounded-lg` |

`font-sans` uses the `--font-sans` variable the app sets with `next/font`. Add a
`dark` class to an ancestor element to switch to dark mode.

## Usage

Import the global styles in an app or package stylesheet:

```css
@import "@workspace/tailwind/globals.css";
```

Reuse the PostCSS configuration from a `postcss.config.ts`:

```typescript
export { default } from "@workspace/tailwind/postcss.config";
```

## Scripts

- **bun run clean** - Remove generated directories
