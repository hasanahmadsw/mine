import type { Lang } from './i18n-config';

export function fmt(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}

export function getDirection(lang: Lang): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function isRTL(lang: Lang): boolean {
  return getDirection(lang) === 'rtl';
}

export function getLocalizedRoute(pathname: string, newLang: Lang): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && ['en', 'ar'].includes(segments[0])) {
    segments[0] = newLang;
    return '/' + segments.join('/');
  }
  return `/${newLang}${pathname.startsWith('/') ? pathname : '/' + pathname}`;
}

export function getAlternateLocale(locale: Lang): Lang {
  return locale === 'en' ? 'ar' : 'en';
}

/** URL path prefix for a locale. English (default) has no prefix, Arabic uses /ar */
export function getPathPrefix(lang: Lang): string {
  return lang === 'en' ? '' : `/${lang}`;
}
