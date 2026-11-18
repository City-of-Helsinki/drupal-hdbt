import type { estypes } from '@elastic/elasticsearch';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getFetcher } from '../helpers/Fetcher';
import type { MapResult } from '../helpers/KarttaUrl';
import type VehicleRemoval from '../types/VehicleRemoval';
import useVehicleRemovalQuery from './useVehicleRemovalQuery';

// About 300 notice numbers fit into a kartta.hel.fi URL
export const MAP_FETCH_SIZE = 300;

type MapSource = Pick<VehicleRemoval, 'notice_number' | 'map_url'>;

// The index may return single values as arrays.
const first = (value: unknown): unknown => (Array.isArray(value) ? value[0] : value);

/**
 * Gets the notice number of a search hit.
 */
export const getNoticeNumber = (hit: estypes.SearchHit<MapSource>): number | null => {
  const noticeNumber = Number(first(hit._source?.notice_number));
  return Number.isInteger(noticeNumber) && noticeNumber > 0 ? noticeNumber : null;
};

/**
 * Fetches the notice numbers and map links of all results of the current search,
 * not just the current page.
 */
const useMapResults = () => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;
  const query = useVehicleRemovalQuery({ size: MAP_FETCH_SIZE, from: 0, source: ['notice_number', 'map_url'] });
  const fetcher = useMemo(() => getFetcher(url), [url]);

  const { data, error, isLoading } = useSWR<estypes.SearchResponse<MapSource>>(query, fetcher, {
    revalidateOnFocus: false,
  });

  const results = useMemo(
    () =>
      (data?.hits?.hits ?? []).flatMap((hit): MapResult[] => {
        const noticeNumber = getNoticeNumber(hit);
        const mapUrl = String(first(hit._source?.map_url) ?? '').trim();
        return noticeNumber ? [{ noticeNumber, mapUrl }] : [];
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
