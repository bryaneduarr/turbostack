import type { RequestLogEntry } from "@/types/logging/requests/request-log-entry.interface";

export const requestLogs = new WeakMap<Request, RequestLogEntry>();
