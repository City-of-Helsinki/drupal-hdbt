// biome-ignore-all lint/suspicious/noExplicitAny: @todo UHF-12501
import { capitalize } from '../helpers/helpers';
import type Aggregations from '../types/Aggregations';
import type { AggregationItem, CustomAggs } from '../types/Aggregations';
import type OptionType from '../types/OptionType';

export default function useAggregations(aggregations: Aggregations, indexKey: string, filterKey: string) {
  let options: OptionType[] = [];

  if (aggregations?.[indexKey]?.buckets) {
    let buckets: AggregationItem[] = [];

    // Get all aggs that are not the actual filter items.
    Object.keys(aggregations).forEach((key: string) => {
      if (key !== filterKey) {
        buckets = [...buckets, ...aggregations[key].buckets];
      }
    });

    // Combine aggs and hit count.
    const aggs: CustomAggs = buckets.reduce((acc: any, current: AggregationItem) => {
      const existingItem: any = Object.values(acc).find((value: any) => value.key === current.key);

      if (existingItem) {
        acc[current.key] = { key: current.key, doc_count: existingItem.doc_count + current.doc_count };
        return acc;
      }

      acc[current.key] = current;
      return acc;
    }, []);

    options = aggregations[filterKey].buckets.map((bucket: AggregationItem) => {
      let label = `${capitalize(bucket.key)} (0)`;
      const match: any = Object.values(aggs).find((item: any) => item.key === bucket.key);

      if (match !== undefined) {
        label = `${capitalize(bucket.key)} (${match.doc_count})`;
      }

      return { label, value: bucket.key };
    });
  }

  return options;
}
