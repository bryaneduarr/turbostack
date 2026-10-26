export function restoreFormValues(form: HTMLFormElement, values: FormData) {
  for (const element of form.elements) {
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) ||
      element.name === "" ||
      (element instanceof HTMLInputElement && element.type === "file")
    ) {
      continue;
    }
    const submitted = values.getAll(element.name);
    if (
      element instanceof HTMLInputElement &&
      (element.type === "checkbox" || element.type === "radio")
    ) {
      element.checked = submitted.includes(element.value);
    } else {
      element.value = String(submitted[0] ?? "");
    }
  }
}
