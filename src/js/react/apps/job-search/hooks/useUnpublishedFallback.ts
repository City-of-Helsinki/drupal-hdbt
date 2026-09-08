import type { QueryDslQueryContainer, SearchRequest, SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import timeoutFetch from '@/react/common/helpers/TimeoutFetch';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import { getElasticUrlAtom } from '../store';
import type Job from '../types/Job';
import useQueryString from './useQueryString';

type UnpublishedJob = Pick<Job, 'title'>;

const useUnpublishedFallback = (enabled: boolean): string[] => {
  const mainQueryString = useQueryString();
  const elasticUrl = useAtomValue(getElasticUrlAtom);
  const { index } = Global;

  const buildBody = (): string => {
    const parsed: SearchRequest = JSON.parse(mainQueryString);
    const bool = parsed.query?.bool;

    if (bool?.filter) {
      const filters: QueryDslQueryContainer[] = Array.isArray(bool.filter) ? bool.filter : [bool.filter];
      const statusIdx = filters.findIndex((filter) => filter?.term?.[IndexFields.STATUS] === true);

      if (statusIdx >= 0) {
        filters[statusIdx] = { term: { [IndexFields.STATUS]: false } };
      }

      bool.filter = filters;
    }

    return JSON.stringify({ query: parsed.query, size: 20, _source: [IndexFields.TITLE, IndexFields.NID] });
  };

  const body = buildBody();

  const fetcher = async (): Promise<SearchResponse<UnpublishedJob>> => {
    const res = await timeoutFetch(`${elasticUrl}/${index}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return res.json();
  };

  const { data } = useSWR(enabled ? body : null, fetcher, { revalidateOnFocus: false });

  return data?.hits?.hits?.flatMap((hit) => hit._source?.title?.[0] ?? []) ?? [];
};

export default useUnpublishedFallback;
