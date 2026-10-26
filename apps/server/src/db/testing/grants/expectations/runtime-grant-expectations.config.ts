import type { RoleGrantExpectations } from "@/types/db/testing/grants/database-grant-expectation.interface";

// Every table in the public schema must appear for every runtime role.
export const runtimeGrantExpectations: RoleGrantExpectations = {
  users_profile: {
    privileges: ["SELECT", "INSERT"],
    updatableColumns: ["first_name", "last_name", "updated_at"],
  },
};
