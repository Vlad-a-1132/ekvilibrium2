import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/seo/site";

/** Публичный origin за reverse proxy (nginx, pm2), не внутренний localhost. */
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost?.split(",")[0]?.trim() || request.headers.get("host")?.trim();

  if (host && !/^localhost(:\d+)?$/i.test(host) && !/^127\.0\.0\.1(:\d+)?$/i.test(host)) {
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }

  return getSiteUrl();
}

export function redirectTo(request: Request, pathnameWithSearch: string, status = 303): NextResponse {
  const url = new URL(pathnameWithSearch, getRequestOrigin(request));
  return NextResponse.redirect(url, status);
}
