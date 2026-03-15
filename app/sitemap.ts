import type { MetadataRoute } from "next";
import { seoConfig } from "@/utils/seo/seo.config";
import { getSortedIdeasData } from "@/lib/ideas";

const staticPaths = ["/", "/about", "/philosophy", "/ideas"] as const;

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

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  entries.push(
    buildSitemapEntry("/", "/ar", {
      changeFrequency: "weekly",
      priority: 1,
    })
  );
  entries.push(buildSitemapEntry("/about", "/ar/about"));
  entries.push(buildSitemapEntry("/philosophy", "/ar/philosophy"));
  entries.push(buildSitemapEntry("/ideas", "/ar/ideas"));

  // Idea pages - English
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

  // Idea pages - Arabic (may have different slugs; add only if not already in list)
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
