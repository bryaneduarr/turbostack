import type { NotFoundHandler } from "hono";
import { NOT_FOUND } from "@/utils/http-status-codes";

/**
 * NotFoundHandler middleware for handling 404 Not Found errors.
 *
 * This handler returns a JSON response with a message indicating
 * that the requested path was not found.
 *
 * @param c - Hono context object containing the request information.
 * @returns JSON response with a 404 status code and error message.
 */
const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND} Not Found: ${c.req.path}`,
    },
    NOT_FOUND,
  );
};

export default notFound;
