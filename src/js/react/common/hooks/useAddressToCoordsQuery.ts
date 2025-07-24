import { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from '../enum/ServiceMap';
import getNameTranslation from '../helpers/ServiceMap';

/**
 * Queries service map api to transform address top coordinates.
 * Returned coordinates are in WGS84.
 *
 * @param {string|null|undefined} address Address to query
 * @param {number|string} pageSize Maximum number of results
 *
 * @return {Promise} Promise resolvingto an array containing coordinates.
 */
const useAddressToCoordsQuery = async(
  address: string|null|undefined,
  pageSize: number|string = 1,
): Promise<[number, number, string]|null> => {
  if (!address) {
    return null;
  }

  const params = ['fi', 'sv'].map(lang => new URLSearchParams({
    format: 'json',
    language: lang,
    municipality: 'helsinki',
    page: '1',
    page_size: pageSize.toString(),
    q: address,
    type: 'address',
  }));

  const results: Array<Promise<ServiceMapResponse<ServiceMapAddress>>> = params.map(param => {
    const url = new URL(ServiceMap.EVENTS_URL);
    url.search = param.toString();

    return fetch(url.toString()).then(response => response.json());
  });

  const settled = await Promise.allSettled(results);
  const fulfilled = settled.filter((result: PromiseSettledResult<ServiceMapResponse<ServiceMapAddress>>) => (
    result.status === 'fulfilled' && result?.value.results?.length
  ));

  const coordinates: Array<[number, number, string]> = (fulfilled as Array<PromiseFulfilledResult<ServiceMapResponse<ServiceMapAddress>>>).map(result => (
    [...result.value.results[0].location.coordinates, getNameTranslation(result.value.results[0].name, drupalSettings.path.currentLanguage) || '']
  ));

  return coordinates.length ? coordinates[0] : null;
};

export default useAddressToCoordsQuery;
