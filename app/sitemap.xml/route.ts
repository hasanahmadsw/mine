import {
  generateSitemapEntities,
} from "@/lib/sitemap-data";
import { seoConfig } from "@/utils/seo/seo.config";
import { i18n } from "@/utils/translations/i18n-config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const siteURL = seoConfig.siteURL;

export async function GET() {
  const sitemapIndexXml = generateSitemapIndex();

  return new NextResponse(sitemapIndexXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function generateSitemapIndex(): string {
  const sitemaps = generateSitemapEntities();

  const sitemapsXml = sitemaps
    .flatMap((sitemap) => {
      const langsToInclude = (i18n.locales as readonly string[]);

      return langsToInclude.flatMap((lang: string) =>
        Array.from(
          { length: sitemap.count },
          (_, id) => `
  <sitemap>
    <loc>${siteURL}/sitemap/${lang}/${sitemap.entity}/${id + 1}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        )
      );
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;
}
