const testDatabaseSuffix = "_test";

// Idempotent because Playwright workers inherit the name their parent already derived.
export function toTestDatabaseName(databaseName: string): string {
  return databaseName.endsWith(testDatabaseSuffix)
    ? databaseName
    : `${databaseName}${testDatabaseSuffix}`;
}
