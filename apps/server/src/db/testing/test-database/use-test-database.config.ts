import { toTestDatabaseName } from "@workspace/database/config/test-database/test-database-name.service";
import { databaseTargetEnvSchema } from "@workspace/schemas/database/environment/target/database-target-env.schema";

// Preloaded by bun test before any test imports the database configuration.
process.env.DB_NAME = toTestDatabaseName(
  databaseTargetEnvSchema.parse(process.env).DB_NAME,
);
