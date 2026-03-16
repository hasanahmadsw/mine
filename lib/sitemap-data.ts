import type { MetadataRoute } from "next";
import { getSortedIdeasData } from "@/lib/ideas";
import { getCaseStudies } from "@/lib/case-studies";
import type { Lang } from "@/utils/translations/i18n-config";

const MAX_LOCS_PER_SITEMAP = Number.parseInt(process.env.MAX_LOCS_PER_SITEMAP || "1000");

export const SITEMAP_ENTITIES = ["static", "ideas", "case-studies"] as const;
export type SitemapEntity = (typeof SITEMAP_ENTITIES)[number];

type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority?: number;
};

function buildEntry(
  url: string,
  options?: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority?: number;
  }
): SitemapEntry {
  return {
    url,
    lastModified: options?.lastModified ?? new Date(),
    changeFrequency: options?.changeFrequency ?? "monthly",
    priority: options?.priority ?? 0.8,
  };
}

/**
 * Static pages - returns paths for the given lang.
 * en: /, /about, ...
 * ar: /ar, /ar/about, ...
 */
export function getStaticUrls(lang: Lang): SitemapEntry[] {
  const prefix = lang === "ar" ? "/ar" : "";
  return [
    buildEntry(prefix || "/", { changeFrequency: "weekly", priority: 1 }),
    buildEntry(`${prefix}/about`),
    buildEntry(`${prefix}/work-with-me`),
    buildEntry(`${prefix}/case-studies`),
    buildEntry(`${prefix}/philosophy`),
    buildEntry(`${prefix}/ideas`),
  ];
}

/**
 * Idea pages - returns paths for the given lang with pagination.
 */
export function getIdeasUrls(
  lang: Lang,
  page: number
): { urls: SitemapEntry[]; count: number } {
  const ideasEn = getSortedIdeasData("en");
  const ideasAr = getSortedIdeasData("ar");
  const slugsEn = new Set(ideasEn.map((i) => i.slug));
  const allIdeas = [...ideasEn, ...ideasAr.filter((i) => !slugsEn.has(i.slug))];
  const prefix = lang === "ar" ? "/ar" : "";
  const start = (page - 1) * MAX_LOCS_PER_SITEMAP;
  const urls = allIdeas.slice(start, start + MAX_LOCS_PER_SITEMAP).map((idea) =>
    buildEntry(`${prefix}/ideas/${idea.slug}`, {
      lastModified: new Date(idea.date),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );
  return { urls, count: allIdeas.length };
}

/**
 * Case study pages - returns paths for the given lang with pagination.
 */
export function getCaseStudiesUrls(
  lang: Lang,
  page: number
): { urls: SitemapEntry[]; count: number } {
  const caseStudiesEn = getCaseStudies("en");
  const caseStudiesAr = getCaseStudies("ar");
  const slugs = new Set([
    ...caseStudiesEn.map((c) => c.slug),
    ...caseStudiesAr.map((c) => c.slug),
  ]);
  const allSlugs = Array.from(slugs);
  const prefix = lang === "ar" ? "/ar" : "";
  const start = (page - 1) * MAX_LOCS_PER_SITEMAP;
  const urls = allSlugs.slice(start, start + MAX_LOCS_PER_SITEMAP).map((slug) =>
    buildEntry(`${prefix}/case-studies/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );
  return { urls, count: allSlugs.length };
}

/**
 * Generate sitemap entities for the sitemap index.
 * Returns entity, count, and indexedLanguagesOnly (for mine: false = all langs).
 */
export function generateSitemapEntities(): {
  entity: SitemapEntity;
  count: number;
  indexedLanguagesOnly: boolean;
}[] {
  const { count: ideasCount } = getIdeasUrls("en", 1);
  const { count: caseStudiesCount } = getCaseStudiesUrls("en", 1);

  return [
    { entity: "static", count: 1, indexedLanguagesOnly: false },
    {
      entity: "ideas",
      count: Math.ceil(ideasCount / MAX_LOCS_PER_SITEMAP) || 1,
      indexedLanguagesOnly: false,
    },
    {
      entity: "case-studies",
      count: Math.ceil(caseStudiesCount / MAX_LOCS_PER_SITEMAP) || 1,
      indexedLanguagesOnly: false,
    },
  ];
}
