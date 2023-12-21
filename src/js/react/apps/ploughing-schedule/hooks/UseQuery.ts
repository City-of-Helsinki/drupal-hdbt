import useSWR from 'swr';
import { useAtomValue } from 'jotai';

import SearchParams from '../types/SearchParams';
import configurationsAtom from '../store';
import getQueryString from '../helpers/GetQueryString';

const UseQuery = (params: SearchParams) => {
  const { baseUrl, index } = useAtomValue(configurationsAtom);

  const fetcher = async () => {
    const { keyword } = params;

    if (!keyword) {
      return;
    }

    return fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: getQueryString(keyword),
    }).then((res) => res.json());
  };

  const { data, error, isLoading, isValidating } = useSWR(`_${  Object.values(params).toString()}`, fetcher, {
    revalidateOnFocus: false
  });

  return {
    data,
    error,
    isLoading,
    isValidating
  };
};

export default UseQuery;
