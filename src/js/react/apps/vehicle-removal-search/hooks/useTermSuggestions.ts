import type { estypes } from '@elastic/elasticsearch';
import type { SearchFunction } from 'hds-react';
import { useCallback } from 'react';
import type VehicleRemoval from '../types/VehicleRemoval';

/**
 * Fields in the mobilenote_data index that hold a list of terms.
 * This keeps useTermSuggestions and TermFilter in sync.
 */
export type TermField = {
  [FieldName in keyof VehicleRemoval]-?: NonNullable<VehicleRemoval[FieldName]> extends string[] ? FieldName : never;
}[keyof VehicleRemoval];

type TermSuggestionsResponse = estypes.SearchResponse<
  VehicleRemoval,
  Partial<Record<TermField, estypes.AggregationsStringTermsAggregate>>
>;

/**
 * Query suggestions for a field from the values present in the mobilenote_data index.
 *
 * @param field - The index field to aggregate.
 * @param toIncludePattern - Converts the search term into a regex for the terms
 *   aggregation include, or an empty string when there is nothing to search for.
 *   Define it outside the component so the search function stays stable.
 */
const useTermSuggestions = (field: TermField, toIncludePattern: (searchTerm: string) => string) => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;

  return useCallback<SearchFunction>(
    async (searchTerm, _selectedOptions, _data) => {
      const include = toIncludePattern(searchTerm);

      if (!include) {
        return { options: [] };
      }

      const query = {
        size: 0,
        aggs: {
          [field]: {
            terms: {
              field,
              include,
              size: 50,
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

      const data: TermSuggestionsResponse = await response.json();
      const buckets = data.aggregations?.[field]?.buckets ?? [];
      // Buckets are an array unless the aggregation is keyed.
      const terms = (Array.isArray(buckets) ? buckets : Object.values(buckets)).map(({ key }) => String(key));

      return { options: terms.map((term) => ({ value: term, label: term })) };
    },
    [url, field, toIncludePattern],
  );
};

export default useTermSuggestions;
