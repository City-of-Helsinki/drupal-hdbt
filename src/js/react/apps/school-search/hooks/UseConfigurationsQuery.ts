import useSWR from 'swr';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import AppSettings from '../enum/AppSettings';
import { AGGREGATIONS } from '../helpers/FeatureQuery';

const UseConfigurationsQuery = () => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;
  const { index } = AppSettings;

  const body = JSON.stringify(AGGREGATIONS);

  const fetcher = async () => {
    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12501
    const result = await useTimeoutFetch(`${proxyUrl}/${index}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!result.ok) {
      throw new Error('Initialization failed.');
    }

    const data = await result.json();

    const { aggregations } = data;

    if (!aggregations) {
      return { aggs: {}, baseUrl: proxyUrl };
    }

    return { aggs: aggregations, baseUrl: proxyUrl };
  };

  const { data, error } = useSWR('configurations', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    suspense: true,
  });

  return { data, error };
};

export default UseConfigurationsQuery;
