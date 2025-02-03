import { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';

/**
 * Serice map url for querying location data.
 */
const serviceMapUrl = 'https://api.hel.fi/servicemap/v2/search';

/**
 * Queries service map api to transform address top coordinates.
 * Returned coordinates are in WGS84.
 *
 * @param {string|null|undefined} address Address to query
 * @param {number|string} pageSize Maximum number of results
 *
 * @return {Promise} Promise resolvingto an array containing coordinates.
 */
const useAddressToCoordsQuery = async(address: string|null|undefined, pageSize: number|string = 1) => {
  if (!address) {
    return [];
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
    const url = new URL(serviceMapUrl);
    url.search = param.toString();

    return fetch(url.toString()).then(response => response.json());
  });

  const fulfilled = await Promise.allSettled(results);
  const coordinates = fulfilled
    .filter(result => {
      if (result.status === 'fulfilled' && result.value.results.length) {
        return true;
      }

      return false;
    })
    // Rejected promises are filtered out, but map doesn't understand that.
    // @ts-ignore
    .map((result: PromiseSettledResult<ServiceMapResponse<ServiceMapAddress>>) => result.value.results[0].location.coordinates);

  return coordinates.length ? coordinates[0] : [];
};

export default useAddressToCoordsQuery;
