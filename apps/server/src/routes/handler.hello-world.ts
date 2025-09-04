import logger from "@/middleware/defaults/pino-logger";
import { AppRouterHandler } from "@/types/openapi";
import { INTERNAL_SERVER_ERROR, OK } from "@/utils/http-status-codes";

import { HelloWorldRoute } from "./route.hello-world";

export const helloWorldHandler: AppRouterHandler<HelloWorldRoute> = (c) => {
  try {
    return c.json(
      {
        error: {},
        message: "Hello World!",
        success: true,
      },
      OK,
    );
  } catch (error) {
    logger.error(
      `An unexpected error occurred while processing the request. ${error}`,
    );
    return c.json(
      {
        error: {
          server: [
            "An unexpected error occurred while processing the request.",
          ],
        },
        message: "Internal server error.",
        success: false,
      },
      INTERNAL_SERVER_ERROR,
    );
  }
};
