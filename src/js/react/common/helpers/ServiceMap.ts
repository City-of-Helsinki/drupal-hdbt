import type { ServiceMapAddress, ServiceMapResponse, TranslatedString } from '@/types/ServiceMap';
import ServiceMapUrls from '../enum/ServiceMap';

export class ServiceMapUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceMapUnavailableError';
  }
}

export const fetchServiceMap = async <T>(url: string, init?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause;
    }

    throw new ServiceMapUnavailableError(`Service map request failed: ${url}`, { cause });
  }

  if (!response.ok) {
    throw new ServiceMapUnavailableError(`Service map responded with ${response.status}: ${url}`);
  }

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new ServiceMapUnavailableError(`Service map response was not valid JSON: ${url}`, { cause });
  }
};

export const sanitizeAddress = (address: string): string => address.replace(/[^\p{L}\p{N} .,'+\-&|]/gu, '');

export const firstRejectionReason = (settled: readonly PromiseSettledResult<unknown>[]): unknown =>
  settled.find((result): result is PromiseRejectedResult => result.status === 'rejected')?.reason;

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

  const settled = await Promise.allSettled(
    ['fi', 'sv'].map((language) => {
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

      return fetchServiceMap<ServiceMapResponse<ServiceMapAddress>>(url.toString());
    }),
  );

  if (settled.every((result) => result.status === 'rejected')) {
    throw new ServiceMapUnavailableError('Address could not be resolved, every service map request failed.', {
      cause: firstRejectionReason(settled),
    });
  }

  const match = settled
    .filter(
      (result): result is PromiseFulfilledResult<ServiceMapResponse<ServiceMapAddress>> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value.results?.[0])
    .find((result) => Boolean(result));

  if (!match) {
    return null;
  }

  return [...match.location.coordinates, getNameTranslation(match.name, drupalSettings.path.currentLanguage) || ''];
};

export default getNameTranslation;
