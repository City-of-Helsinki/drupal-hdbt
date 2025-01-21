import useSWR from 'swr';
import { PublicConfiguration } from 'swr/_internal';
import Global from '../enum/Global';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';

type UseIndexQueryProps = {
  // Keep previous result while revalidating from swr.
  keepPreviousData?: boolean
  // Uses _mquery endpoint if true
  multi?: boolean;
  // Elastic query
  query: string;
}
// Allow passing SWR hook options
& Partial<PublicConfiguration>;

const useIndexQuery = ({ query, multi, ...rest }: UseIndexQueryProps) => {
  const fetcher = () => {
    const proxyUrl = drupalSettings?.helfi_react_search?.elastic_proxy_url;
    const url: string|undefined = proxyUrl;
    const { index } = Global;
    const endpoint = multi ? '_msearch' : '_search';
    const contentType = `application/${multi ? 'x-ndjson' : 'json'}`;

    return useTimeoutFetch(`${url}/${index}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: query,
    }).then((res) => res.json());
  };

  return useSWR(query, fetcher, {
    revalidateOnFocus: false,
    ...rest
  });

};

export default useIndexQuery;
