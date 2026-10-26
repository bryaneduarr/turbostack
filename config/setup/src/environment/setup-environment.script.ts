import { setupEnvironment } from "@workspace/setup/environment/setup-environment.module";

try {
  await setupEnvironment();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
