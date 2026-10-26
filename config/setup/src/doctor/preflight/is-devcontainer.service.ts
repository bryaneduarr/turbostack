export function isDevcontainer(): boolean {
  return process.env.DEVCONTAINER === "true";
}
