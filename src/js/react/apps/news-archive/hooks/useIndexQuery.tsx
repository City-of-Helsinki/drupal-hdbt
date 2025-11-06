import useSWR from 'swr';
import type { PublicConfiguration } from 'swr/_internal';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import Global from '../enum/Global';

type useIndexQueryProps = {
  // Dev purposes only, use this to debug certain requests
  debug?: boolean;
  // Custom key for query, use if you dont want to use query as key
  key?: string;
  // Uses _mquery endpoint if true
  multi?: boolean;
  // Elastic query
  query: string;
} & Partial<PublicConfiguration>; // Allows passing SWR hook options

const useIndexQuery = ({
  debug,
  query,
  multi,
  key,
  ...rest
}: useIndexQueryProps) => {
  const fetcher = () => {
    const index = Global.INDEX;
    const url: string | undefined =
      drupalSettings?.helfi_news_archive?.elastic_proxy_url;
    const endpoint = multi ? '_msearch' : '_search';
    const contentType = multi ? 'application/x-ndjson' : 'application/json';

    if (debug) {
      console.warn('Executing request with props: ', {
        debug,
        query,
        multi,
      });
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12501
    return useTimeoutFetch(`${url}/${index}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: query,
    }).then((res) => res.json());
  };

  return useSWR(key || query, fetcher, {
    revalidateOnFocus: false,
    ...rest,
  });
};

export default useIndexQuery;
