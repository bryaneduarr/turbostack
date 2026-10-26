// Thrown at the end of a test transaction so the database rolls it back.
export class RollbackSignal extends Error {}
