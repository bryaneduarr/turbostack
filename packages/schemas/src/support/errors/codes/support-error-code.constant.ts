import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";
import type { SupportErrorCode } from "@workspace/schemas/support/errors/codes/support-reference.interface";

export const SUPPORT_ERROR_CODE = {
  PAGE_NOT_FOUND: "PAGE-001",
  PAGE_CRASHED: "PAGE-002",
  PAGE_REJECTED: "PAGE-003",
  API_NOT_FOUND: "API-001",
  API_VALIDATION: "API-002",
  API_PARSE: "API-003",
  API_UNAUTHORIZED: "API-004",
  API_FORBIDDEN: "API-005",
  API_CONFLICT: "API-006",
  API_SERVICE_UNAVAILABLE: "API-007",
  API_REQUEST_ERROR: "API-008",
  API_INTERNAL_SERVER_ERROR: "API-009",
  NET_UNREACHABLE: "NET-001",
  NET_UNEXPECTED_RESPONSE: "NET-002",
} as const;

export const SUPPORT_ERROR_CODE_DESCRIPTION = {
  [SUPPORT_ERROR_CODE.PAGE_NOT_FOUND]:
    "This page could not be found. Check the address, or contact support if the link should work. No reference ID is needed.",
  [SUPPORT_ERROR_CODE.PAGE_CRASHED]:
    "This page failed unexpectedly. Send support the error digest from the web app log.",
  [SUPPORT_ERROR_CODE.PAGE_REJECTED]:
    "This page stopped before contacting the server because a link or form is out of date. Reload the page and try again. No reference ID is needed.",
  [SUPPORT_ERROR_CODE.API_NOT_FOUND]:
    "The server could not find the requested item. Send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.API_VALIDATION]:
    "The server rejected the submitted values. Check the form, and send support the request ID shown with this error if it keeps happening.",
  [SUPPORT_ERROR_CODE.API_PARSE]:
    "The server could not read the submitted request. Send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.API_UNAUTHORIZED]:
    "The server did not accept the request's credentials. Send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.API_FORBIDDEN]:
    "This action is not allowed. Send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.API_CONFLICT]:
    "The item changed or already exists. Reload the page and try again, or send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.API_SERVICE_UNAVAILABLE]:
    "The service is temporarily unavailable. Try again later, or send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.API_REQUEST_ERROR]:
    "The server could not complete the request. Send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.API_INTERNAL_SERVER_ERROR]:
    "The server failed unexpectedly. Send support the request ID shown with this error.",
  [SUPPORT_ERROR_CODE.NET_UNREACHABLE]:
    "The server could not be reached. Check your connection and try again. No reference ID is needed.",
  [SUPPORT_ERROR_CODE.NET_UNEXPECTED_RESPONSE]:
    "The server sent a response the app did not expect. Send support the request ID shown with this error.",
} satisfies Record<SupportErrorCode, string>;

export const API_SUPPORT_ERROR_CODE = {
  NOT_FOUND: SUPPORT_ERROR_CODE.API_NOT_FOUND,
  VALIDATION: SUPPORT_ERROR_CODE.API_VALIDATION,
  PARSE: SUPPORT_ERROR_CODE.API_PARSE,
  UNAUTHORIZED: SUPPORT_ERROR_CODE.API_UNAUTHORIZED,
  FORBIDDEN: SUPPORT_ERROR_CODE.API_FORBIDDEN,
  CONFLICT: SUPPORT_ERROR_CODE.API_CONFLICT,
  SERVICE_UNAVAILABLE: SUPPORT_ERROR_CODE.API_SERVICE_UNAVAILABLE,
  REQUEST_ERROR: SUPPORT_ERROR_CODE.API_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR: SUPPORT_ERROR_CODE.API_INTERNAL_SERVER_ERROR,
} satisfies Record<ErrorResponse["error"]["code"], SupportErrorCode>;
