# shadcn/ui monorepo template

This is a template that uses [Turbo Repo](https://turbo.build/repo/docs) as a **Mono Repo**. [Tailwind CSS v.4.0.1](https://tailwindcss.com/docs/installation/using-vite). [Shadcn UI](https://ui.shadcn.com/docs).

It also includes [ESLint](https://eslint.org/docs/latest/) and [Prettier](https://prettier.io/docs/) configuration.

## Package Manager

Package manager used for this template is [PNPM](https://pnpm.io/motivation).

You can use the following command to install the required dependencies:

```bash
pnpm install
```

## Tasks

The following tasks are included with [Turbo Repo](https://turbo.build/repo/docs), they can be used with the package manager [PNPM](https://pnpm.io/motivation).

### clean

Cleans all the unnecessary folders that are not needed for pushing remote.

```bash
pnpm run clean
```

### format

Uses [Prettier](https://prettier.io/docs/) to format all the files of the project following the rules from [./config/prettier/base.js](./config/prettier/base.js) and ignores files from [./.gitignore](./.gitignore) and [./.prettierignore](./.prettierignore)

```bash
pnpm run format
```

### lint

Uses [ESLint](https://eslint.org/docs/latest/) to lint most of the files of the project following the rules from [ ./config/eslint/base.js](./config/eslint/base.js).

```bash
pnpm run lint
```

### build

Uses [Next.js](https://nextjs.org/docs) to build the client project.

```bash
pnpm run build
```

### dev

Uses [Next.js](https://nextjs.org/docs) to run the development project.

```bash
pnpm run dev
```

## Installing a component

You can install a component using [Shadcn UI](https://ui.shadcn.com/docs) by following the next commands:

Enter [./packages/ui/](./packages/ui/) with the command.

```bash
cd ./packages/ui/
```

Install the package you desire from [Shadcn UI](https://ui.shadcn.com/docs):

```bash
npx shadcn@latest add component
```

## Tailwind CSS

[Tailwind CSS v.4.0.1](https://tailwindcss.com/docs/installation/using-vite) is in the latest version `4.0.1`. You can find all the configuration in [./config/tailwind/](./config/tailwind/).

The file [globals.css](./config/tailwind/globals.css) is based on the file from [this file](https://github.com/shadcn/app-tailwind-v4/blob/main/app/globals.css).

## Using components

To use the components in your app, import them from the [ui package](./packages/ui/).

```tsx
import Button from "@workspace/ui/components/ui/button";
```

You can also create your own component and later export it like the example of [Basic Date Picker](./packages/ui/src/components/ui/basic-date-picker.tsx). Then import it in your application as normal [page.tsx](./apps/client/src/app/page.tsx).

```tsx
import DatePicker from "@workspace/ui/components/ui/basic-date-picker";
```
