import { seoConfig } from "../seo.config";
import { getPathPrefix } from "@/utils/translations/language-utils";
import type { Lang } from "@/utils/translations/i18n-config";
import type { IdeaMeta } from "@/lib/ideas";
import { createBreadcrumbForGraph } from "./common";

export function generateIdeaArticleSchema(
  lang: Lang,
  idea: IdeaMeta,
  slug: string
): object {
  const prefix = getPathPrefix(lang);
  const pathPrefix = prefix ? `${prefix}/` : "/";
  const ideaUrl = `${seoConfig.siteURL}${pathPrefix}ideas/${slug}`;
  const ideasUrl = `${seoConfig.siteURL}${pathPrefix}ideas`;
  const homeUrl = `${seoConfig.siteURL}${prefix || "/"}`;

  const breadcrumbItems = [
    { name: "Home", url: homeUrl },
    { name: "Ideas", url: ideasUrl },
    { name: idea.title, url: ideaUrl },
  ];

  const breadcrumb = createBreadcrumbForGraph(breadcrumbItems);

  const article = {
    "@type": "Article",
    headline: idea.title,
    description: idea.excerpt,
    datePublished: idea.date,
    author: {
      "@type": "Person",
      name: idea.author,
    },
    publisher: {
      "@id": seoConfig.personId,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": ideaUrl,
    },
    url: ideaUrl,
    inLanguage: lang === "ar" ? "ar" : "en",
    ...(idea.image && {
      image: idea.image.startsWith("http")
        ? idea.image
        : `${seoConfig.siteURL}${idea.image}`,
    }),
  };

  const itemPage = {
    "@type": "ItemPage",
    "@id": `${ideaUrl}#webpage`,
    url: ideaUrl,
    name: idea.title,
    description: idea.excerpt,
    breadcrumb: { "@id": `${ideaUrl}#breadcrumb` },
    mainEntity: { "@id": `${ideaUrl}#article` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...article, "@id": `${ideaUrl}#article` },
      { ...breadcrumb, "@id": `${ideaUrl}#breadcrumb` },
      itemPage,
    ],
  };
}
