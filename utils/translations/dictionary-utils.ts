import { cache } from 'react';
import type { Lang } from './i18n-config';
import type { Dictionaries } from './dictionary-types';

const dictionaryCache = new Map<Lang, Dictionaries>();

export const getDictionary = cache(async (lang: Lang): Promise<Dictionaries> => {
  const cached = dictionaryCache.get(lang);
  if (cached) return cached;

  try {
    const dict = await import(`@/dictionaries/${lang}.json`);
    const dictionaries = dict.default as Dictionaries;
    dictionaryCache.set(lang, dictionaries);
    return dictionaries;
  } catch (error) {
    console.error(`Error loading dictionaries for locale "${lang}":`, error);
    throw error;
  }
});

export function validateLocale(locale: string | undefined): locale is Lang {
  if (!locale || !['en', 'ar'].includes(locale)) {
    return false;
  }
  return true;
}
