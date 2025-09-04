import { serve } from "@hono/node-server";

import app from "./app";
import env from "./env";
import logger from "./middleware/defaults/pino-logger";

const port = Number(env.PORT);
logger.info(`[server]: Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
