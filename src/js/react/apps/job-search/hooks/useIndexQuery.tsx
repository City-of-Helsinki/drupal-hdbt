import useSWR from 'swr';
import { PublicConfiguration } from 'swr/_internal';

type UseIndexQueryProps = {
  // Uses _mquery endpoint if true
  multi?: boolean;
  // Elastic query
  query: string;
}
// Allow passing SWR hook options
& Partial<PublicConfiguration>;

const useIndexQuery = ({ query, multi, ...rest }: UseIndexQueryProps) => {
  const fetcher = () => {
    const proxyUrl = drupalSettings?.helfi_rekry_job_search?.elastic_proxy_url;
    const url: string|undefined = proxyUrl || process.env.REACT_APP_ELASTIC_URL;
    const endpoint = multi ? '_msearch' : '_search';
    const contentType = `application/${multi ? 'x-ndjson' : 'json'}`;

    return fetch(`${url}/${endpoint}`, {
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
