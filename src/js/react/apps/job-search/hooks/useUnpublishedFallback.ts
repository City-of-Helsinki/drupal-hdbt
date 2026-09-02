import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import { getElasticUrlAtom } from '../store';
import useQueryString from './useQueryString';

const useUnpublishedFallback = (enabled: boolean): string[] => {
  const mainQueryString = useQueryString();
  const elasticUrl = useAtomValue(getElasticUrlAtom);
  const { index } = Global;

  const body = useMemo(() => {
    const parsed = JSON.parse(mainQueryString);
    // Swap the published filter (status: true) for unpublished (status: false)
    const filters: any[] = parsed.query.bool.filter;
    const statusIdx = filters.findIndex((f: any) => f?.term?.status === true);
    if (statusIdx >= 0) {
      filters[statusIdx] = { term: { [IndexFields.STATUS]: false } };
    }
    return JSON.stringify({ query: parsed.query, size: 20, _source: [IndexFields.TITLE, IndexFields.NID] });
  }, [mainQueryString]);

  const fetcher = async () => {
    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12501
    const res = await useTimeoutFetch(`${elasticUrl}/${index}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return res.json();
  };

  const { data } = useSWR(enabled ? body : null, fetcher, { revalidateOnFocus: false });

  return data?.hits?.hits?.map((h: any) => h._source?.title?.[0]).filter(Boolean) ?? [];
};

export default useUnpublishedFallback;
