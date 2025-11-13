export type AggregationItem = { key: string; doc_count: number };

export type CustomAggs = { [key: string]: AggregationItem[] };

type Aggregation = { buckets: AggregationItem[] };

export type Aggregations = { [key: string]: Aggregation };

export default Aggregations;
