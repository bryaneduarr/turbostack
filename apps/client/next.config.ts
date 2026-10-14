import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "standalone",
  // Standalone tracing must include workspace packages above this app.
  outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
  transpilePackages: [
    "@workspace/api-client",
    "@workspace/schemas",
    "@workspace/ui",
    "@workspace/utils",
  ],
};

export default nextConfig;
