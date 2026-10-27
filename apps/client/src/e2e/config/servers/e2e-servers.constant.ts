// Separate from the 3000 and 3001 dev ports so a running `bun run dev` never conflicts.
export const E2E_CLIENT_PORT = 3100;
export const E2E_API_PORT = 3101;

export const E2E_CLIENT_URL = `http://localhost:${E2E_CLIENT_PORT}`;
export const E2E_API_URL = `http://localhost:${E2E_API_PORT}`;
