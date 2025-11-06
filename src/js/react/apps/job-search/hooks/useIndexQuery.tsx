import useSWR from 'swr';
import type { PublicConfiguration } from 'swr/_internal';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import Global from '../enum/Global';

type UseIndexQueryProps = {
  // Keep previous result while revalidating from swr.
  keepPreviousData?: boolean;
  // Uses _mquery endpoint if true
  multi?: boolean;
  // Elastic query
  query: string;
} & Partial<PublicConfiguration>; // Allow passing SWR hook options

const useIndexQuery = ({ query, multi, ...rest }: UseIndexQueryProps) => {
  const fetcher = async () => {
    const url: string | undefined = drupalSettings?.helfi_react_search?.elastic_proxy_url;
    const { index } = Global;
    const endpoint = multi ? '_msearch' : '_search';
    const contentType = `application/${multi ? 'x-ndjson' : 'json'}`;

    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12066
    const res = await useTimeoutFetch(`${url}/${index}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: query,
    });

    return res.json();
  };

  return useSWR(query, fetcher, {
    revalidateOnFocus: false,
    ...rest,
  });
};

export default useIndexQuery;
