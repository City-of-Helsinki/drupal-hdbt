import type { ServiceMapAddress, ServiceMapResponse, TranslatedString } from '@/types/ServiceMap';
import ServiceMapUrls from '../enum/ServiceMap';

export const sanitizeAddress = (address: string): string => address.replace(/[^\p{L}\p{N} .,'+\-&|]/gu, '');

export const getNameTranslation = (names: TranslatedString, language: string | null) => {
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

export type AddressCoordinates = [number, number, string];

export const getAddressCoordinates = async (
  address: string | null | undefined,
  pageSize: number | string = 1,
): Promise<AddressCoordinates | null> => {
  const sanitized = address ? sanitizeAddress(address) : '';

  if (!sanitized) {
    return null;
  }

  const results = ['fi', 'sv'].map((language) => {
    const url = new URL(ServiceMapUrls.EVENTS_URL);
    url.search = new URLSearchParams({
      format: 'json',
      language,
      municipality: 'helsinki',
      page: '1',
      page_size: pageSize.toString(),
      q: sanitized,
      type: 'address',
    }).toString();

    return fetch(url.toString()).then((response) => response.json());
  });

  const settled = await Promise.allSettled<ServiceMapResponse<ServiceMapAddress>>(results);
  const fulfilled = settled.filter(
    (result): result is PromiseFulfilledResult<ServiceMapResponse<ServiceMapAddress>> =>
      result.status === 'fulfilled' && Boolean(result.value.results?.length),
  );

  if (!fulfilled.length) {
    return null;
  }

  const match = fulfilled[0].value.results[0];

  return [...match.location.coordinates, getNameTranslation(match.name, drupalSettings.path.currentLanguage) || ''];
};

export default getNameTranslation;
