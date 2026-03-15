"use client";

import { useEffect } from "react";
import { getDirection } from "@/utils/translations/language-utils";
import type { Lang } from "@/utils/translations/i18n-config";

interface LangAttributeProps {
  lang: Lang;
}

/** Sets document lang and dir for SEO and accessibility. Root layout cannot access [lang] params. */
export function LangAttribute({ lang }: LangAttributeProps) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = getDirection(lang);
  }, [lang]);
  return null;
}
