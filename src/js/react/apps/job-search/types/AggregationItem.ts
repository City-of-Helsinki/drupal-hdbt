import type { AggregationItem as CommonAggItem } from '@/types/Aggregation';

type AggregationItem = CommonAggItem & { unique?: { value: number } };

export default AggregationItem;
