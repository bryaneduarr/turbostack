export function readProvisionSql(): Promise<string> {
  // The build copies the init SQL next to this module; the container runs the same file.
  return Bun.file(
    new URL("initdb/01-provision-database-roles.sql", import.meta.url),
  ).text();
}
