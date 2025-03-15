# Turborepo - Tailwind v4 - Shadcn/ui

This is a template that uses [Turbo Repo](https://turbo.build/repo/docs) as a **Mono Repo**. [Tailwind CSS v.4](https://tailwindcss.com/docs/installation/using-vite) with [Shadcn/ui](https://ui.shadcn.com/docs).

## Project structure

It is divided into three separate folders that contains the **Monorepo** structure:

1. [Configuration files](./config/) in here you will find the configuration for the following project dependencies:

   - [ESLint](./config/eslint/)
   - [Prettier](./config/prettier/) configuration.
   - [Tailwind CSS](./config/tailwind/)
   - [TypeScript](./config/typescript/)

2. [Packages](./packages/) you will find the packages you are going to work in your project, for example they could be [Shadcn/ui](https://ui.shadcn.com/docs) components that you need or general components that are required to be shared across multiple apps in this **Monorepo**.

3. [Apps](./apps/) here is the plce you wi put your aplications or your overall structure of the project. This can be projects like [Next.JS](https://nextjs.org/) or [Node.JS](https://nodejs.org/en).

## Package Manager

Package manager used for this template is [PNPM](https://pnpm.io/motivation).

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

[Tailwind CSS v.4](https://tailwindcss.com/docs/installation/using-vite) is in the latest version `v4`. You can find all the configuration in [here](./config/tailwind/).

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

## Available Scripts

Some of the following tasks or commands are handled with [Turborepo](https://turbo.build/repo/docs), they can be used with the package manager [PNPM](https://pnpm.io/motivation) as a regular script, the main difference is that they will work across the project.

Installs the dependencies needed for the project to work.

```sh
pnpm install
```

Updates all the packages and dependencies of all the projects and configuration files to the latest version.

```sh
pnpm run update
```

Cleans all the unnecessary folders that are not needed for developing or pushing to remote.

```bash
pnpm run clean
```

Checks any error found of [TypeScript](./config/typescript/) types in the projects that uses [TypeScript](./config/typescript/).

```sh
pnpm run check-types
```

Uses [Prettier](https://prettier.io/docs/) to format all the files of the project following the rules from [./config/prettier/base.js](./config/prettier/base.js) and ignores files from [./.gitignore](./.gitignore) and [./.prettierignore](./.prettierignore)

```bash
pnpm run format
```

Uses [ESLint](https://eslint.org/docs/latest/) to lint most of the files of the project following the rules from [./config/eslint/base.js](./config/eslint/base.js).

```bash
pnpm run lint
```

Uses [Next.js](https://nextjs.org/docs) to build the client project.

```bash
pnpm run build
```

```bash
pnpm run dev
```
