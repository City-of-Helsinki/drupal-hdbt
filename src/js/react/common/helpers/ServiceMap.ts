import type { TranslatedString } from '@/types/ServiceMap';

export const getNameTranslation = (
  names: TranslatedString,
  language: string | null,
) => {
  if (language && names[language as 'fi' | 'sv' | 'en']) {
    return names[language as 'fi' | 'sv' | 'en'];
  }

  if (names.fi) {
    return names.fi;
  }

  if (names.sv) {
    return names.sv;
  }

  throw new Error('No name found');
};

export default getNameTranslation;
