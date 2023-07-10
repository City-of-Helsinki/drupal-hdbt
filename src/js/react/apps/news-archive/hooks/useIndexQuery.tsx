import useSWR from 'swr';
import Global from '../enum/Global';

const useIndexQuery = (query: string, multi: boolean = false) => {
  const fetcher = () => {
    const index = Global.INDEX;
    const proxyUrl = drupalSettings?.helfi_news_archive?.elastic_proxy_url;
    const url: string|undefined = proxyUrl || process.env.REACT_APP_ELASTIC_URL;
    const endpoint = multi ? '_msearch' : '_search';
    const contentType = multi ? 'application/x-ndjson' : 'application/json';

    return fetch(`${url}/${index}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: query,
    }).then((res) => res.json());
  };

  return useSWR(query, fetcher, {
    revalidateOnFocus: false
  });
};

export default useIndexQuery;
