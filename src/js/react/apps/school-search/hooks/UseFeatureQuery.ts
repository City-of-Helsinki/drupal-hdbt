import { useAtomValue } from 'jotai';
import useSWR from 'swr';

import { configurationsAtom } from '../store';
import AppSettings from '../enum/AppSettings';
import getQueryString from '../helpers/FeatureQuery';
import type SearchParams from '../types/SearchParams';

const UseFeatureQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);
  const { query } = params;

  const fetcher = () => {
    const { index } = AppSettings;

    return fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: getQueryString(params, page),
    }).then((res) => res.json());
  };

  const { data, error, isLoading, isValidating } = useSWR(
    `_${query || ''}}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
  };
};

export default UseFeatureQuery;
