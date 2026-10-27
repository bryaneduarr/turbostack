// Browsers always submit text inputs, so a missing entry means nothing was typed.
export function readFormText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}
