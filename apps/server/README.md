# Express TypeScript Server

A type-safe **Back-End** server application built with **Express.JS** and **TypeScript**. This server provides a foundation for building maintainable services with modern TypeScript.

## Features

- **TypeScript Integration** - Full type safety throughout the application
- **Express.JS Framework** - Fast and minimalist web framework
- **Environment Configuration** - Type-safe environment variable management
- **Hot Reloading** - Development server with nodemon for instant feedback
- **Code Quality Tools** - ESLint and Prettier integration
- **Path Aliases** - TypeScript path mapping for cleaner imports
- **Monorepo Ready** - Designed to work within a Turborepo structure

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- bun, yarn, or npm package manager (bun is recommended)

### Installation

Clone the repository

```sh
git clone https://github.com/bryaneduarr/turbostack.git
```

Install dependencies:

```sh
bun install
```

Create a `.env` file based on the [.env.example](./.env.example) template:

```sh
cp .env.example .env
```

### Development

Start the development server with hot reloading (Nodemon):

```sh
bun run dev
```

The server will be available at [http://localhost:3001](http://localhost:3001) by default.

Build the TypeScript project:

```sh
bun run build
```

The compiled JavaScript will be generated in the `dist/` directory.

Starting the Production Server

```sh
bun run start
```

## Available Scripts

- **bun build** - Compile TypeScript to JavaScript with path alias resolution
- **bun check-types** - Check TypeScript types without emitting files
- **bun clean** - Remove generated directories (dist, node_modules, .turbo)
- **bun dev** - Start development server with hot reloading
- **bun format** - Format code with Prettier
- **bun lint** - Lint code with ESLint
- **bun start** - Start the production server
- **bun update** - Update dependencies to their latest versions

## Environment Configuration

The application uses a type-safe configuration module to manage environment variables. You can extend the Config interface in [env.ts](./src/config/env.ts) to add new environment variables:

```typescript
// Example: Adding a new DATABASE_URL environment variable.
interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string; // New environment variable.
}

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/mydb", // New environment variable with default value.
};
```

## TypeScript Path Aliases

The project is configured with TypeScript path aliases for cleaner imports:

`@/*` - Resolves to the [./src](./src/) directory

Example usage:

```typescript
// Instead of this:
import config from "../config/config";

// You can use:
import config from "@/config/config";
```
