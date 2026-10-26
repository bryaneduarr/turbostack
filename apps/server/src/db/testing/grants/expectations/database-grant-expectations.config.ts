import { DATABASE_ROLES } from "@workspace/schemas/database/roles/database-role.constant";
import { cliGrantExpectations } from "@/db/testing/grants/expectations/cli-grant-expectations.config";
import { runtimeGrantExpectations } from "@/db/testing/grants/expectations/runtime-grant-expectations.config";
import type {
  RoleGrantExpectations,
  RuntimeDatabaseRole,
} from "@/types/db/testing/grants/database-grant-expectation.interface";

export const databaseGrantExpectations: Readonly<
  Record<RuntimeDatabaseRole, RoleGrantExpectations>
> = {
  [DATABASE_ROLES.runtime]: runtimeGrantExpectations,
  [DATABASE_ROLES.cli]: cliGrantExpectations,
};
