import pino from "pino";
import env from "@/config/environment/server-env.config";
import { serializeLogError } from "@/services/logging/errors/serialize-log-error.service";

// Redaction is a fallback, not permission to log full requests or arbitrary objects.
const sensitiveFields = [
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "DB_PASSWORD",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "api-key",
  "x-api-key",
  "secret",
  "clientSecret",
  "connectionString",
  "DATABASE_URL",
  "Authorization",
  "Cookie",
  "Set-Cookie",
  "X-API-Key",
  "api_key",
  "access_token",
  "refresh_token",
  "client_secret",
  "sessionId",
];
const redactPaths = sensitiveFields.flatMap((field) => [
  `["${field}"]`,
  `*["${field}"]`,
  `*.*["${field}"]`,
]);
const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: "server", environment: env.NODE_ENV },
  redact: {
    paths: [
      ...redactPaths,
      "headers",
      "req.headers",
      "res.headers",
      "request.headers",
      "response.headers",
      "body",
      "req.body",
      "request.body",
      "query",
      "params",
    ],
    remove: true,
  },
  serializers: { err: serializeLogError },
  ...(env.NODE_ENV === "development" && process.stdout.isTTY
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, singleLine: true },
        },
      }
    : {}),
});

export default logger;
