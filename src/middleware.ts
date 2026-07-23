import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Locale policy from TZ doc 04 §4: never sniff Accept-Language or IP. A first
 * visit renders UZ. An explicit language switch persists a cookie, and that
 * choice is honored on return visits — only at the site root, so shared deep
 * links always open in the language they were shared in (hreflang integrity).
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" && request.cookies.get("locale")?.value === "ru") {
    const url = request.nextUrl.clone();
    url.pathname = "/ru";
    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes, Next internals and any file with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
