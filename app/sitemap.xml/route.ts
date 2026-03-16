import { NextResponse } from "next/server";
import { getSitemapEntries } from "@/lib/sitemap-data";
import { seoConfig } from "@/utils/seo/seo.config";

export const dynamic = "force-dynamic";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date: Date): string {
  return date.toISOString();
}

export async function GET() {
  const entries = getSitemapEntries();
  const baseUrl = seoConfig.siteURL;
  const xslUrl = `${baseUrl}/sitemap.xsl`;

  const urlEntries = entries.flatMap((entry) => {
    const urls: string[] = [];
    const lastmod = entry.lastModified
      ? formatDate(
          typeof entry.lastModified === "string"
            ? new Date(entry.lastModified)
            : entry.lastModified
        )
      : formatDate(new Date());
    const changefreq = entry.changeFrequency ?? "monthly";
    const priority = entry.priority ?? 0.8;

    // Main URL
    urls.push(
      `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`
    );

    // Alternate language links
    if (entry.alternates?.languages) {
      const alts = entry.alternates.languages;
      for (const [lang, href] of Object.entries(alts)) {
        if (lang !== "x-default" && href && href !== entry.url) {
          urls.push(
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}"/>`
          );
        }
      }
    }

    urls.push("  </url>");
    return urls.join("\n");
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${escapeXml(xslUrl)}"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
