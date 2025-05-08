# Turbostack

This project is a comprehensive **monorepo** template built with [Turborepo](https://turbo.build/repo/docs) that provides a complete **full-stack** development environment for modern web applications. It includes [Tailwind CSS v.4](https://tailwindcss.com/docs/installation/using-vite) with [Shadcn/ui](https://ui.shadcn.com/docs) ready to use.

Please read each **README.md** for each package for a better understanding of the project.

## Project structure

This template is organized into a clean monorepo structure with three main sections:

1. **[Configuration files](./config/)**: In here you will find the configuration for the following project dependencies:

   - [ESLint](./config/eslint/)
   - [Prettier](./config/prettier/) configuration.
   - [TypeScript](./config/typescript/)

2. **[Packages](./packages/)**: Sharable packages across your project.

   - Pre-configured, accessible components and utilities ready to use across applications
   - Easy integration of new components via [Shadcn/ui](https://ui.shadcn.com/docs) CLI (components)

3. **[Applications](./apps/)**: Main applications where you will be working on

   - Client - [Next.js](https://nextjs.org/docs) 15 application with [React 19](https://reactjs.org/) and [Turbopack](https://turbo.build/pack)
   - Server - [Express.js](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/) back-end with hot reloading using **Nodemon**

## Package Manager

Package manager used for this template is [PNPM](https://pnpm.io/motivation).

## Tailwind CSS

[Tailwind CSS v.4](https://tailwindcss.com/docs/installation/using-vite) is in the latest version `v4`. You can find all the configuration in [here](./config/tailwind/).

The file [globals.css](./packages/ui/src/styles/globals.css) is based on the file from [this external file](https://github.com/shadcn/app-tailwind-v4/blob/main/app/globals.css).

## Available Scripts

Some of the following tasks or commands are handled with [Turborepo](https://turbo.build/repo/docs), they can be used with the package manager [PNPM](https://pnpm.io/motivation) as a regular script, the main difference is that they will work across the project.

Installs the dependencies needed for the project to work.

```sh
pnpm install
```

Uses [Next.js](https://nextjs.org/docs) to build the client project and [TypeScript](https://www.typescriptlang.org/) to build the server project (TSC).

```bash
pnpm run build
```

Cleans all the unnecessary folders that are not needed for developing or pushing to remote.

```bash
pnpm run clean
```

Checks any error found of [TypeScript](./config/typescript/) types in the projects that uses [TypeScript](./config/typescript/).

```sh
pnpm run check-types
```

Starts the development server for the client project using [Next.js](https://nextjs.org/docs) and [Turbopack](https://turbo.build/pack) with hot reloading. It also starts the server project using [Express.js](https://expressjs.com/) with hot reloading using **Nodemon**.

```bash
pnpm run dev
```

Uses [Prettier](https://prettier.io/docs/) to format all the files of the project following the rules from [./config/prettier/base.js](./config/prettier/base.js) and ignores files from [./.gitignore](./.gitignore) and [./.prettierignore](./.prettierignore)

```bash
pnpm run format
```

Uses [ESLint](https://eslint.org/docs/latest/) to lint most of the files of the project following the rules from [./config/eslint/base.js](./config/eslint/base.js).

```bash
pnpm run lint
```

Updates all the packages and dependencies of all the projects and configuration files to the latest version.

```sh
pnpm run update
```

With a single command you can run all the tasks above in parallel, this is the recommended way to run the project.

```sh
pnpm run setup
```

This command does the same as `pnpm run setup` but it includes the script for `update` that will update all the packages and dependencies to the latest version and also execute all the scripts tasks in parallel.

```sh
pnpm run setup:update
```
