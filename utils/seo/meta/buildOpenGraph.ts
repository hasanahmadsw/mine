import type { Metadata } from "next";
import { i18n } from "@/utils/translations/i18n-config";
import { getPathPrefix } from "@/utils/translations/language-utils";
import { seoConfig } from "../seo.config";

export interface OpenGraphInput {
  lang: (typeof i18n)["locales"][number];
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
  pathname?: string;
  authors?: { name: string; url?: string }[];
}

export function buildOpenGraph(input: OpenGraphInput): Metadata["openGraph"] {
  const {
    lang,
    title,
    description,
    type = "website",
    pathname = "",
    authors,
  } = input;

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const prefix = getPathPrefix(lang);
  const fullPath =
    (prefix + normalizedPath).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  const url = `${seoConfig.siteURL}${fullPath}`;
  const img = input.image || seoConfig.ogImage;

  const og: Metadata["openGraph"] = {
    title,
    description,
    images: [
      {
        url: img,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    siteName: seoConfig.siteName,
    url,
    locale: lang === "ar" ? "ar_US" : "en_US",
    type,
    ...(type === "article" &&
      authors &&
      authors.length > 0 && {
        authors: authors.map((a) =>
          a.url ? `${seoConfig.siteURL}${a.url}` : a.name,
        ),
      }),
  };

  og!.alternateLocale = lang === "ar" ? "en_US" : "ar_US";

  return og;
}
