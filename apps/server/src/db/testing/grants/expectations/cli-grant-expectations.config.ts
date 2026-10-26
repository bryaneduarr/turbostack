import { readOnly } from "@/db/testing/grants/expectations/grant-expectation-presets.config";
import type { RoleGrantExpectations } from "@/types/db/testing/grants/database-grant-expectation.interface";

// Every table in the public schema must appear for every runtime role.
export const cliGrantExpectations: RoleGrantExpectations = {
  users_profile: readOnly,
};
