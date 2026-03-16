import type { MetadataRoute } from "next";
import { seoConfig } from "@/utils/seo/seo.config";
import { getSortedIdeasData } from "@/lib/ideas";
import { getCaseStudies } from "@/lib/case-studies";

function buildSitemapEntry(
  pathEn: string,
  pathAr: string,
  options?: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority?: number;
  }
): MetadataRoute.Sitemap[0] {
  const urlEn = `${seoConfig.siteURL}${pathEn}`;
  const urlAr = `${seoConfig.siteURL}${pathAr}`;
  return {
    url: urlEn,
    lastModified: options?.lastModified ?? new Date(),
    changeFrequency: options?.changeFrequency ?? "monthly",
    priority: options?.priority ?? 0.8,
    alternates: {
      languages: {
        en: urlEn,
        ar: urlAr,
        "x-default": urlEn,
      },
    },
  };
}

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  entries.push(
    buildSitemapEntry("/", "/ar", {
      changeFrequency: "weekly",
      priority: 1,
    })
  );
  entries.push(buildSitemapEntry("/about", "/ar/about"));
  entries.push(buildSitemapEntry("/work-with-me", "/ar/work-with-me"));
  entries.push(buildSitemapEntry("/case-studies", "/ar/case-studies"));
  entries.push(buildSitemapEntry("/philosophy", "/ar/philosophy"));
  entries.push(buildSitemapEntry("/ideas", "/ar/ideas"));

  const caseStudiesEn = getCaseStudies("en");
  const caseStudiesAr = getCaseStudies("ar");
  const caseStudySlugs = new Set([
    ...caseStudiesEn.map((c) => c.slug),
    ...caseStudiesAr.map((c) => c.slug),
  ]);
  for (const slug of caseStudySlugs) {
    entries.push(
      buildSitemapEntry(`/case-studies/${slug}`, `/ar/case-studies/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  }

  const ideasEn = getSortedIdeasData("en");
  for (const idea of ideasEn) {
    entries.push(
      buildSitemapEntry(`/ideas/${idea.slug}`, `/ar/ideas/${idea.slug}`, {
        lastModified: new Date(idea.date),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );
  }

  const ideasAr = getSortedIdeasData("ar");
  const slugsEn = new Set(ideasEn.map((i) => i.slug));
  for (const idea of ideasAr) {
    if (!slugsEn.has(idea.slug)) {
      entries.push(
        buildSitemapEntry(`/ideas/${idea.slug}`, `/ar/ideas/${idea.slug}`, {
          lastModified: new Date(idea.date),
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
    }
  }

  return entries;
}
