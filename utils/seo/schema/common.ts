import type {
  WithContext,
  WebSite,
  Organization,
  Person,
  BreadcrumbList,
  ListItem,
} from "schema-dts";
import { seoConfig } from "../seo.config";
import { getPathPrefix } from "@/utils/translations/language-utils";
import type { Lang } from "@/utils/translations/i18n-config";

export function generateWebSiteSchema(lang: Lang): WithContext<WebSite> {
  const prefix = getPathPrefix(lang);
  const url = `${seoConfig.siteURL}${prefix || "/"}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": seoConfig.websiteId,
    name: seoConfig.siteName,
    url,
    publisher: { "@id": seoConfig.personId },
    inLanguage: lang === "ar" ? "ar" : "en",
  };
}

/** Person schema for personal websites — more appropriate than Organization */
export function generatePersonSchema(): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": seoConfig.personId,
    name: seoConfig.siteName,
    url: seoConfig.siteURL,
    image: seoConfig.ogImage,
    jobTitle: "Founder",
    description:
      "Founder building digital systems, platforms, and products that power real businesses.",
  };
}

export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": seoConfig.organizationId,
    name: seoConfig.siteName,
    url: seoConfig.siteURL,
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): WithContext<BreadcrumbList> {
  const listItems: ListItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listItems,
  };
}

/** Returns BreadcrumbList for use inside @graph (no @context) */
export function createBreadcrumbForGraph(
  items: { name: string; url: string }[]
): BreadcrumbList {
  const listItems: ListItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return {
    "@type": "BreadcrumbList",
    itemListElement: listItems,
  };
}
