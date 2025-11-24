import useSWR from 'swr';
import type { PublicConfiguration } from 'swr/_internal';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import Global from '../enum/Global';
import { useAtomValue } from 'jotai';
import { getElasticUrlAtom } from '../store';

type UseIndexQueryProps = {
  // Keep previous result while revalidating from swr.
  keepPreviousData?: boolean;
  // Uses _mquery endpoint if true
  multi?: boolean;
  // Elastic query
  query: string;
} & Partial<PublicConfiguration>; // Allow passing SWR hook options

const useIndexQuery = ({ query, multi, ...rest }: UseIndexQueryProps) => {
  const elasticUrl = useAtomValue(getElasticUrlAtom);

  const fetcher = async () => {
    const { index } = Global;
    const endpoint = multi ? '_msearch' : '_search';
    const contentType = `application/${multi ? 'x-ndjson' : 'json'}`;

    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12501
    const res = await useTimeoutFetch(`${elasticUrl}/${index}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: query,
    });

    return res.json();
  };

  return useSWR(query, fetcher, { revalidateOnFocus: false, ...rest });
};

export default useIndexQuery;
