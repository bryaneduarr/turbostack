import type { TableGrantExpectation } from "@/types/db/testing/grants/database-grant-expectation.interface";

export const readOnly = {
  privileges: ["SELECT"],
  updatableColumns: [],
} as const satisfies TableGrantExpectation;
