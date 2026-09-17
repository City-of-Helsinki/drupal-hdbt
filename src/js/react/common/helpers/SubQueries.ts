import GlobalSettings from '@/react/common/enum/GlobalSettings';
import type { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import { fetchServiceMap, firstRejectionReason, ServiceMapUnavailableError } from './ServiceMap';

export const getAddressUrls = (address: string) => {
  const { addressBaseUrl } = GlobalSettings;
  const languages = ['fi', 'sv'];

  // Servicemap's search endpoint works only with one language, distinct urls is needed to get both lang data
  return languages.map((language: string) => {
    const url = new URL(addressBaseUrl);
    const params = new URLSearchParams(url.search);
    params.set('q', address);
    params.set('language', language);
    url.search = params.toString();

    return url.toString();
  });
};

export const getAddresses = async (urls: string[]): Promise<ServiceMapResponse<ServiceMapAddress>[]> => {
  const settled = await Promise.allSettled(
    urls.map((url: string) => fetchServiceMap<ServiceMapResponse<ServiceMapAddress>>(url)),
  );

  if (settled.every((result) => result.status === 'rejected')) {
    throw new ServiceMapUnavailableError('Address could not be resolved, every service map request failed.', {
      cause: firstRejectionReason(settled),
    });
  }

  return settled
    .filter(
      (result): result is PromiseFulfilledResult<ServiceMapResponse<ServiceMapAddress>> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value);
};

export const parseCoordinates = (addressData: ServiceMapResponse<ServiceMapAddress>[]) => {
  const [lon, lat]: number[] = addressData[0].results[0].location.coordinates;
  return [lat, lon];
};

export const getLocationsUrl = (locationsBaseUrl: string, lat: number | undefined, lon: number | undefined) => {
  const url = new URL(locationsBaseUrl);
  const params = new URLSearchParams(url.search);

  if (lat && lon) {
    params.set('lon', lon.toString());
    params.set('lat', lat.toString());
  }

  url.search = params.toString();

  return url.toString();
};
