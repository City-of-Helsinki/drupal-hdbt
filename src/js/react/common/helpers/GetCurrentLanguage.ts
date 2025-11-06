// helpers/getCurrentLanguage.ts
export type SupportedLanguage = 'fi' | 'sv' | 'en';

export function getCurrentLanguage(
  lang: string | undefined,
): SupportedLanguage {
  return lang === 'fi' || lang === 'sv' || lang === 'en' ? lang : 'fi';
}
