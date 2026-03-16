import { i18n, type Lang } from "@/utils/translations/i18n-config";
import { seoConfig } from "@/utils/seo/seo.config";
import { MetadataRoute } from "next";

const siteURL = seoConfig.siteURL;

/** All languages for sitemap (mine has en, ar) */
export const SITEMAP_LANGUAGES = i18n.locales as readonly string[];

/**
 * Check if a language should be included in the sitemap
 */
export function isLanguageInSitemap(lang: Lang): boolean {
  return (SITEMAP_LANGUAGES as readonly string[]).includes(lang);
}

/**
 * Remove lang prefix from URL path for hreflang generation.
 * /ar/about -> /about, /ar -> /, /about -> /about
 */
function removeLangFromUrl(url: string): string {
  const exactLangPattern = /^\/ar$/;
  const langWithSlashPattern = /^\/ar\//;

  if (exactLangPattern.test(url)) return "/";
  if (langWithSlashPattern.test(url)) return url.replace(langWithSlashPattern, "/");
  return url;
}

/**
 * Build full URL for a language given path without lang.
 * en: /about -> siteURL/about, / -> siteURL/
 * ar: /about -> siteURL/ar/about, / -> siteURL/ar
 */
function buildUrlForLang(lang: Lang, pathWithoutLang: string): string {
  if (lang === "ar") {
    return `${siteURL}/ar${pathWithoutLang === "/" ? "" : pathWithoutLang}`;
  }
  return `${siteURL}${pathWithoutLang}`;
}

export function generateSitemapXml(urls: MetadataRoute.Sitemap): string {
  const urlsXml = urls
    .map((url) => {
      const urlWithoutLang = removeLangFromUrl(url.url);
      return `
  <url>
    <loc>${siteURL}${url.url}</loc>
    <lastmod>${
      typeof url.lastModified === "string"
        ? url.lastModified
        : (url.lastModified ?? new Date())?.toISOString()
    }</lastmod>
    ${(i18n.locales as readonly string[]).map((lang) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${buildUrlForLang(lang as Lang, urlWithoutLang)}"/>`).join("\n    ")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${buildUrlForLang("en", urlWithoutLang)}"/>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlsXml}
</urlset>`;
}
