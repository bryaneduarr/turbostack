import { existsSync } from "node:fs";
import { serverEnvSchema } from "@workspace/schemas/server/environment/server-env.schema";
import { defineConfig } from "vitest/config";

const envFile = new URL(".env", import.meta.url);

if (existsSync(envFile)) process.loadEnvFile(envFile);

serverEnvSchema.parse({ ...process.env, NODE_ENV: "test" });

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["src/**/*.test.ts"],
    env: { NODE_ENV: "test" },
  },
});
