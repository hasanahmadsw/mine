const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "https://hasanahmad.net";

export const seoConfig = {
  siteName: "Hasan Smadi",
  siteURL,
  ogImage: `${siteURL}/og-image.jpg`,
  websiteId: `${siteURL}#website`,
  personId: `${siteURL}#person`,
  organizationId: `${siteURL}#organization`,
} as const;
