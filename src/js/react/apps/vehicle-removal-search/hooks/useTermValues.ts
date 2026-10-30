import type { estypes } from '@elastic/elasticsearch';
import useSWR from 'swr';
import type VehicleRemoval from '../types/VehicleRemoval';

/**
 * Fields in the mobilenote_data index that hold a list of terms.
 * This keeps useTermValues and TermFilter in sync.
 */
export type TermField = {
  [FieldName in keyof VehicleRemoval]-?: NonNullable<VehicleRemoval[FieldName]> extends string[] ? FieldName : never;
}[keyof VehicleRemoval];

type TermValuesResponse = estypes.SearchResponse<
  VehicleRemoval,
  Partial<Record<TermField, estypes.AggregationsStringTermsAggregate>>
>;

// Upper limit for the number of values. The fields hold postal codes and
// parking zones of Helsinki, so there are far fewer of them than this.
const MAX_VALUES = 500;

// Stable fallback so that consumers do not get a new array on every render.
const NO_VALUES: string[] = [];

const fetchTermValues = async ([url, field]: [string, TermField]): Promise<string[]> => {
  const query = {
    size: 0,
    aggs: {
      [field]: {
        terms: {
          field,
          size: MAX_VALUES,
          order: { _key: 'asc' },
        },
      },
    },
  };

  const response = await fetch(`${url}/mobilenote_data/_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`Fetching ${field} values failed with status ${response.status}`);
  }

  const data: TermValuesResponse = await response.json();
  const buckets = data.aggregations?.[field]?.buckets ?? [];
  // Buckets are an array unless the aggregation is keyed.
  return (Array.isArray(buckets) ? buckets : Object.values(buckets)).map(({ key }) => String(key));
};

/**
 * Get all values of a field present in the mobilenote_data index, sorted alphabetically.
 *
 * @param field - The index field to aggregate.
 */
const useTermValues = (field: TermField): string[] => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;
  const { data } = useSWR(url ? [url, field] : null, fetchTermValues, { revalidateOnFocus: false });

  return data ?? NO_VALUES;
};

export default useTermValues;
