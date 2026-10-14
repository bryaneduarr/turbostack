let draining = false;

export function startServerDraining(): void {
  draining = true;
}

export function isServerDraining(): boolean {
  return draining;
}
