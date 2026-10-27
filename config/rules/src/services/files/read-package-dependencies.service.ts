const dependencyFields: ReadonlySet<string> = new Set([
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
]);

export async function readPackageDependencies(
  manifestPath: string,
): Promise<Map<string, string>> {
  const manifest: unknown = await Bun.file(manifestPath).json();
  const dependencies = new Map<string, string>();
  if (typeof manifest !== "object" || manifest === null) return dependencies;

  for (const [field, declared] of Object.entries(manifest)) {
    if (!dependencyFields.has(field)) continue;
    if (typeof declared !== "object" || declared === null) continue;
    for (const [name, version] of Object.entries(declared)) {
      if (typeof version === "string") dependencies.set(name, version);
    }
  }
  return dependencies;
}
