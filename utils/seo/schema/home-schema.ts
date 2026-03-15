import { generateWebSiteSchema } from "./common";
import { generatePersonSchema } from "./common";
import { generateOrganizationSchema } from "./common";
import type { Lang } from "@/utils/translations/i18n-config";

export function generateHomeSchema(lang: Lang): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateWebSiteSchema(lang),
      generatePersonSchema(),
      generateOrganizationSchema(),
    ],
  };
}
