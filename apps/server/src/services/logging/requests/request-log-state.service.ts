import type { RequestLogEntry } from "@/types/logging/requests/request-log-entry.interface";

export const headRequests = new WeakSet<Request>();
export const requestLogs = new WeakMap<Request, RequestLogEntry>();
