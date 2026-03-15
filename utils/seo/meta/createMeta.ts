import type { Metadata } from "next";
import { i18n, type Lang } from "@/utils/translations/i18n-config";
import { getPathPrefix } from "@/utils/translations/language-utils";
import { buildOpenGraph } from "./buildOpenGraph";
import { buildTwitter } from "./buildTwitter";
import { seoConfig } from "../seo.config";

export interface EnhancedSeoInput {
  lang: Lang;
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
  keywords?: string[];
  authors?: { name: string; url?: string }[];
  pathname?: string;
  mainOverrides?: Partial<Metadata>;
}

export function createMeta(input: EnhancedSeoInput): Metadata {
  const {
    lang,
    title,
    description,
    type = "website",
    keywords = [],
    authors,
    pathname = "",
    image,
    mainOverrides,
  } = input;

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const prefix = getPathPrefix(lang);
  const fullPath = (prefix + normalizedPath).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  const canonicalUrl = `${seoConfig.siteURL}${fullPath}`;

  const languages: Record<string, string> = {};
  for (const l of i18n.locales) {
    const p = getPathPrefix(l);
    const path = (p + normalizedPath).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    languages[l] = `${seoConfig.siteURL}${path}`;
  }
  const defaultPath = normalizedPath.replace(/\/$/, "") || "/";
  languages["x-default"] = `${seoConfig.siteURL}${defaultPath}`;

  return {
    title,
    description,
    keywords,
    authors: authors ?? [{ name: "Hasan Smadi" }],
    creator: "Hasan Smadi",
    metadataBase: new URL(seoConfig.siteURL),
    openGraph: buildOpenGraph({
      lang,
      title,
      description,
      type,
      image,
      pathname,
      authors,
    }),
    twitter: buildTwitter({ title, description, image }),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    ...mainOverrides,
  };
}
