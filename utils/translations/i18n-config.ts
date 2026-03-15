export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ar'],
} as const;

export type Lang = (typeof i18n)['locales'][number];
