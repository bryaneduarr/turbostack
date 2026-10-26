import { NextResponse } from "next/server";
import { getClientEnvironment } from "@/config/environment/client-env.config";
import { readClientSecurityHeaders } from "@/config/http/security-headers/client-security-headers.config";

export function proxy() {
  const response = NextResponse.next();
  const production = getClientEnvironment().NODE_ENV === "production";
  for (const [name, value] of readClientSecurityHeaders(production)) {
    response.headers.set(name, value);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
