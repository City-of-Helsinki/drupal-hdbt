import type { AggregationItem } from '../../../types/Aggregation';

// Transform Elastic aggregation bucket to key - value map
const bucketToMap = (bucket: AggregationItem[] = []) => {
  const result = new Map();

  bucket.forEach((item) => {
    result.set(item.key, item.doc_count);
  });

  return result;
};

export default bucketToMap;
