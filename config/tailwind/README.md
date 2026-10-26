# @workspace/tailwind

Shared [Tailwind CSS v4](https://tailwindcss.com/) configuration and theme tokens
for the workspace.

## Key Files

- **`globals.css`** - Tailwind import, theme tokens, dark mode, and base styles
- **`postcss.config.ts`** - PostCSS configuration for Tailwind

## Theme Tokens

`globals.css` defines neutral CSS variables for light mode in `:root` and dark
mode under `prefers-color-scheme: dark`, and maps them to Tailwind colors. A
project sets its own look by changing these values:

| Token | Utilities |
|---|---|
| `background`, `foreground` | `bg-background`, `text-foreground` |
| `surface`, `accent` | `bg-surface`, `text-accent` |
| `primary`, `primary-foreground` | `bg-primary`, `text-primary-foreground` |
| `secondary`, `secondary-foreground` | `bg-secondary`, `text-secondary-foreground` |
| `muted`, `muted-foreground` | `bg-muted`, `text-muted-foreground` |
| `destructive`, `destructive-foreground` | `bg-destructive`, `text-destructive` |
| `success`, `warning`, `info` | `text-success`, `text-warning`, `text-info` |
| `border`, `border-strong`, `ring` | `border-border`, `border-border-strong`, `ring-ring` |
| `radius` | `rounded-sm` to `rounded-2xl` |
| `elevation-*` | `shadow-xs` to `shadow-lg` |
| motion | `pressable`, `lift`, `animate-fade-in`, `animate-rise-in`, `ease-smooth`, `ease-spring` |

`font-sans` uses the `--font-sans` variable the app sets with `next/font`. Dark
mode follows the operating system. Lucide icons come from the Iconify plugin as
`icon-[lucide--name]` classes.

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
