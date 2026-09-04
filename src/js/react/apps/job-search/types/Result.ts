import type { SearchHit } from '@elastic/elasticsearch/lib/api/types';

export type Result<T> = Omit<SearchHit<T>, '_source'> & { _source: T };
