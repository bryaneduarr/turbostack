import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["src/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      PORT: "3001",
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_USER: "example-user",
      DB_PASSWORD: "example-password",
      DB_NAME: "example-database",
      DB_SSL_MODE: "disable",
    },
  },
});
