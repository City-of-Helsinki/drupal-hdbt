import type { estypes } from '@elastic/elasticsearch';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getFetcher } from '../helpers/Fetcher';
import type VehicleRemoval from '../types/VehicleRemoval';
import useVehicleRemovalQuery from './useVehicleRemovalQuery';

// More results than this never fit into a kartta.hel.fi URL, even as points.
export const MAP_FETCH_SIZE = 250;

/**
 * Fetches the map links of all results of the current search, not just the current page.
 */
const useMapResults = () => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;
  const query = useVehicleRemovalQuery({ size: MAP_FETCH_SIZE, from: 0, source: ['map_url'] });
  const fetcher = useMemo(() => getFetcher(url), [url]);

  const { data, error, isLoading } = useSWR<estypes.SearchResponse<Pick<VehicleRemoval, 'map_url'>>>(query, fetcher, {
    revalidateOnFocus: false,
  });

  const mapUrls = useMemo(
    () =>
      (data?.hits?.hits ?? [])
        .map((hit) => {
          // The index may return single values as arrays.
          const value: unknown = hit._source?.map_url;
          return String((Array.isArray(value) ? value[0] : value) ?? '').trim();
        })
        .filter(Boolean),
    [data],
  );

  // Search hits fetched for the map, may be fewer than the total.
  const fetched = data?.hits?.hits?.length ?? 0;

  return { mapUrls, fetched, error, isLoading };
};

export default useMapResults;
