import type { MetadataRoute } from "next";
import { seoConfig } from "@/utils/seo/seo.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${seoConfig.siteURL}/sitemap.xml`,
  };
}
