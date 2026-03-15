import { NextRequest, NextResponse } from "next/server";
import { i18n } from "./utils/translations/i18n-config";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // English is default: /en and /en/* should redirect to clean URLs (no /en)
  if (pathname === "/en" || pathname === "/en/") {
    return NextResponse.redirect(new URL("/", request.url), 308);
  }
  if (pathname.startsWith("/en/")) {
    const pathWithoutEn = pathname.slice(4) || "/";
    return NextResponse.redirect(new URL(pathWithoutEn, request.url), 308);
  }

  // Arabic: /ar and /ar/* - allow through (no change)
  if (pathname.startsWith("/ar")) {
    return NextResponse.next();
  }

  // No locale (e.g. /, /about, /thoughts)
  const locale = getLocaleFromRequest(request);

  // If user prefers Arabic, redirect to /ar/* so URL shows the locale
  if (locale === "ar") {
    const arPath = `/ar${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(new URL(arPath, request.url), 308);
  }

  // English (default): rewrite to /en/* internally, URL stays clean (no /en)
  const internalPath = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(new URL(internalPath, request.url));
}

// Define paths that don't need the locale prefix
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicons|robots.txt).*)"],
};

// Get locale preference from request (cookies or headers)
function getLocaleFromRequest(request: NextRequest): string {
  // Check cookie first
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // Then check accepted languages header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    // Parse the accept-language header
    const acceptedLanguages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().substring(0, 2));

    // Find the first accepted language that matches our supported locales
    for (const lang of acceptedLanguages) {
      if (i18n.locales.includes(lang as any)) {
        return lang;
      }
    }
  }

  // Default to the default locale
  return i18n.defaultLocale;
}
