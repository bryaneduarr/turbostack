# UI and styling

These rules are mandatory for every user interface in `apps/` and `packages/ui/`. The template ships neutral tokens; a project sets its own look by changing the tokens, not the components.

## Design tokens are the only source of style values

- All colors, radii, shadows, easings, and durations come from `config/tailwind/globals.css`. Never write raw color values (`#fff`, `rgb()`, `oklch()`), Tailwind palette colors (`bg-zinc-100`, `text-blue-600`), or arbitrary shadow, radius, or easing values in components.
- Add a missing value as a token in that file, with light and dark values, instead of hardcoding it locally. Token changes are design decisions; keep the set small.
- Color roles:
  - `background` and `foreground`: page canvas and body text.
  - `surface`: subtle panels and card wells.
  - `muted` and `muted-foreground`: hover fills and secondary text.
  - `primary` and `primary-foreground`: the main action.
  - `accent`: focus, selection, and informational emphasis only, never large fills.
  - `destructive`, `success`, `warning`, and `info`: status only.
  - `border` and `border-strong`: resting and hovered outlines.
- Dark mode follows the operating system through `prefers-color-scheme`. Never style a component for one scheme only; tokens switch automatically, and `dark:` is reserved for genuine exceptions.

## Typography and spacing

- Use the app's sans font only, through `Heading` and `Text`: `Heading size="page"` for page titles (one `level={1}` per page), `size="section"` for section titles, and `Text size="small" tone="muted"` for supporting copy. Use at most three text sizes per view.
- Use Tailwind's 4px spacing scale. Related controls use `gap-2` or `gap-3`; sections use `gap-6` to `gap-10`. Prefer whitespace to divider lines.
- Every page renders its content inside `Page`, which provides the `main` landmark, padding, width, and entrance motion. `body` is a full-height flex column under the sticky header; never use `min-h-svh` on page content.
- Every app shares one layout: the full-width `AppBar` and `Page` with the same side padding. App pages use `width="app"`; standalone pages such as errors and notices use `width="form"`. Forms inside app pages limit themselves to `max-w-sm`.

## Responsive layout

- Every view works from 150px wide up to desktop. Design small-screen first, and add `sm:`, `md:`, and `lg:` to widen.
- Rows of controls use `flex-wrap`; give a flexible child `min-w-0` with a `basis-*` so it wraps instead of overflowing. Never set a fixed width wider than about 130px on page content.
- Long words, emails, and identifiers wrap anywhere through the base layer; use `truncate` only where the full value is shown elsewhere.
- Tables scroll horizontally inside their frame; never squeeze columns to fit.
- The `AppBar` moves its navigation into a menu below `md`, hides the brand name below 400px and the brand mark below 180px. Hide optional header actions on narrow screens instead of wrapping the bar.

## Shape and elevation

- Radii: `rounded-md` for small controls and tags, `rounded-lg` for buttons and fields, `rounded-xl` for cards, menus, and toasts, `rounded-2xl` for dialogs, and `rounded-full` only for round images and counters.
- Elevation: `shadow-xs` for resting controls, `shadow-sm` for primary buttons, `shadow-md` for hovered cards, and `shadow-lg` for floating layers such as menus, toasts, and dialogs. Combine floating layers with a `border-border` outline.
- Sticky or floating chrome uses `bg-background/80 backdrop-blur-md`.

## Component architecture

Every visual element comes from one reusable source in `packages/ui`, so the same style is present everywhere it applies and absent everywhere else.

### Base components own all visual styling

- Base components are the only code that puts visual classes on native elements: color, typography, borders, radius, shadow, background, opacity, and motion. They live in `packages/ui/src/components/`; the [capability map](../project-context/capabilities.md) lists the current set. Check it before building anything visual.
- Base components are generic: they receive everything through documented props, never fetch data, never call actions, and never import from an app.
- Variants are explicit, required props mapped with `satisfies Record<Props["prop"], string>`. Add a variant to an existing base component before creating a near-duplicate.

### Every other component composes base components

- Composite components combine base components with data, actions, and state. Examples are profile forms, pickers, menus, and dashboards.
- Composites may use only layout utilities: display, flex, grid, gap, margin, padding for arrangement, width, alignment, order, visibility (`hidden`, `sm:block`, `sr-only`), truncation, and wrapping.
- Composites never use color, typography, border, radius, shadow, background, or motion classes. They never style a native `button`, `input`, `select`, `textarea`, `a`, `table`, `h1`-`h3`, or text element by hand.
- A base component's `className` prop accepts layout utilities only; it appends to the base classes and never overrides them.
- Reusable composites belong in `packages/ui`, under their domain, such as `components/profiles/`. Several apps sharing a pattern is reason enough to move it there.
- App-local components exist only for app-specific composition, such as a page's data, its server actions, or an app's navigation. They still follow the composite rules.

### New components inherit from existing sources

- A new visual pattern starts in `packages/ui` as a base component with a documented props interface under `src/types/components/`.
- A new component that resembles an existing one must reuse that component or its shared class map in `packages/ui/src/config/`, such as `button-styles.config.ts` or `text-styles.config.ts`. For example, `ButtonLink` reuses the button maps.
- Never copy a class string from one component into another. Extract it into a config map and import it from both.
- Build components in-house from native elements and the tokens. Do not install or copy third-party component code, including the reference libraries.
- Choose exactly one `primary` button per view or form. Use `outline` or `ghost` for secondary actions, and `destructive` only for irreversible actions. Use `ButtonLink` for navigation and `Button` for actions.

## Icons

- Use Lucide icons only, through the Iconify utility classes such as `icon-[lucide--bell]`. Do not add other icon sets or inline SVG icons.
- Draw icons with the `Icon` component and its size and tone props. Base components may place icon spans directly.
- Decorative icons are `aria-hidden="true"`. Icon-only controls need an `aria-label` that states the destination or action.

## Motion

- Motion confirms an interaction or reveals new content; it never delays a task. Use only the motion tokens and utilities:
  - `pressable` on every clickable element: a scale-down on press plus smooth color transitions. Components already include it.
  - `animate-rise-in` for page and section entrances and `animate-fade-in` for quiet reveals.
  - `ease-smooth` for color and opacity, and `ease-spring` for scale and translate. Durations come from the `--duration-*` tokens.
- Keep a whole entrance under about 600ms.
- Animate only `opacity`, `scale`, `translate`, `filter`, colors, and shadows. Never animate width, height, or position properties that cause layout, except a deliberate `grid-template-rows` collapse.
- Open floating layers with native `popover` or `<dialog>`, using `transition-discrete` with `starting:open:` styles for enter and exit.
- The base layer reduces all motion under `prefers-reduced-motion`; never override that.

## Accessibility and interaction

- Every interactive element shows the global focus outline from `:focus-visible`. Never remove it with `outline-none` unless a field replaces it with the `fieldControlClassName` focus ring.
- Text and essential icons meet WCAG AA contrast in light and dark modes. Use `muted-foreground` only on `background`, `surface`, or `muted`.
- Keep native semantics: buttons for actions, links for navigation, landmark `header`, `nav`, and `main` elements, and one `h1` per page.
- Touch targets are at least 32px (`h-8` or `size-8`) and preferably 36px.
