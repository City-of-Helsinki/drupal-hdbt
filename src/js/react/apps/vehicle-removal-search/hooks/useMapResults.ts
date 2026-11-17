import type { estypes } from '@elastic/elasticsearch';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getFetcher } from '../helpers/Fetcher';
import type { MapResult } from '../helpers/KarttaUrl';
import type VehicleRemoval from '../types/VehicleRemoval';
import useVehicleRemovalQuery from './useVehicleRemovalQuery';

// More results than this do not fit into a kartta.hel.fi URL. With more, the
// map shows all notices instead.
export const MAP_FETCH_SIZE = 500;

type MapSource = Pick<VehicleRemoval, 'nro' | 'map_url'>;

// The index may return single values as arrays.
const first = (value: unknown): unknown => (Array.isArray(value) ? value[0] : value);

/**
 * Gets the notice number of a search hit.
 *
 * Falls back to the end of the item ID ("...ppoytakirjaExtranet.73567") for
 * items indexed before the number was added to the index.
 */
export const getNoticeNumber = (hit: estypes.SearchHit<MapSource>): number | null => {
  const nro = Number(first(hit._source?.nro));
  if (Number.isInteger(nro) && nro > 0) return nro;

  const match = hit._id?.match(/\.(\d+)$/);
  return match ? Number(match[1]) : null;
};

/**
 * Fetches the notice numbers and map links of all results of the current search,
 * not just the current page.
 */
const useMapResults = () => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;
  const query = useVehicleRemovalQuery({ size: MAP_FETCH_SIZE, from: 0, source: ['nro', 'map_url'] });
  const fetcher = useMemo(() => getFetcher(url), [url]);

  const { data, error, isLoading } = useSWR<estypes.SearchResponse<MapSource>>(query, fetcher, {
    revalidateOnFocus: false,
  });

  const results = useMemo(
    () =>
      (data?.hits?.hits ?? []).flatMap((hit): MapResult[] => {
        const nro = getNoticeNumber(hit);
        const mapUrl = String(first(hit._source?.map_url) ?? '').trim();
        return nro ? [{ nro, mapUrl }] : [];
      }),
    [data],
  );

  const hits = data?.hits;
  const total = typeof hits?.total === 'number' ? hits.total : (hits?.total?.value ?? 0);
  // Whether all results of the search were fetched for the map.
  const complete = (hits?.hits?.length ?? 0) >= total;

  return { results, complete, error, isLoading };
};

export default useMapResults;
