import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";
import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  MAX_HTTP_STATUS,
  NOT_FOUND,
  SERVICE_UNAVAILABLE,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { ErrorHandler } from "elysia";
import { getRequestLog } from "@/services/logging/requests/get-request-log.service";
import { createErrorResponse } from "@/services/responses/errors/create-error-response.service";
import { errorResponseMessages } from "@/services/responses/errors/error-response-messages.config";
import { ExpectedFailure } from "@/services/responses/errors/expected-failure.error";

const onError = ({
  code,
  error,
  request,
  set,
}: Parameters<ErrorHandler>[0]) => {
  const entry = getRequestLog(request);

  if (error instanceof ExpectedFailure) {
    if (error.status >= INTERNAL_SERVER_ERROR)
      entry.diagnostic = { kind: "captured", cause: error };
    set.status = error.status;
    return createErrorResponse({
      request,
      code: error.code,
      message: error.message,
      status: error.status,
    });
  }

  let status: number = INTERNAL_SERVER_ERROR;
  if (code === "NOT_FOUND") status = NOT_FOUND;
  else if (code === "VALIDATION") status = UNPROCESSABLE_ENTITY;
  else if (code === "PARSE") status = BAD_REQUEST;
  else if (typeof error === "object" && error !== null && "status" in error) {
    const errorStatus = error.status;
    if (
      typeof errorStatus === "number" &&
      Number.isInteger(errorStatus) &&
      errorStatus >= BAD_REQUEST &&
      errorStatus <= MAX_HTTP_STATUS
    ) {
      status = errorStatus;
    }
  }

  let errorCode: ErrorResponse["error"]["code"] = "REQUEST_ERROR";
  if (code === "NOT_FOUND") errorCode = "NOT_FOUND";
  else if (status === SERVICE_UNAVAILABLE) errorCode = "SERVICE_UNAVAILABLE";
  else if (status >= INTERNAL_SERVER_ERROR) errorCode = "INTERNAL_SERVER_ERROR";
  else if (code === "VALIDATION") errorCode = "VALIDATION";
  else if (code === "PARSE") errorCode = "PARSE";
  else if (status === UNAUTHORIZED) errorCode = "UNAUTHORIZED";
  else if (status === FORBIDDEN) errorCode = "FORBIDDEN";
  else if (status === NOT_FOUND) errorCode = "NOT_FOUND";
  else if (status === CONFLICT) errorCode = "CONFLICT";

  if (status >= INTERNAL_SERVER_ERROR)
    entry.diagnostic = { kind: "captured", cause: error };
  set.status = status;
  return createErrorResponse({
    request,
    code: errorCode,
    message: errorResponseMessages[errorCode],
    status,
  });
};

export default onError;
