import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import getQueryString from '../helpers/GetQueryString';
import configurationsAtom from '../store';
import type SearchParams from '../types/SearchParams';

const UseQuery = (params: SearchParams) => {
  const { baseUrl, index } = useAtomValue(configurationsAtom);

  const fetcher = async () => {
    const { address } = params;

    if (!address) {
      return;
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12501
    return useTimeoutFetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: getQueryString(address),
    }).then((res) => res.json());
  };

  const { data, error, isLoading, isValidating } = useSWR(`_${Object.values(params).toString()}`, fetcher, {
    revalidateOnFocus: false,
  });

  return { data, error, isLoading, isValidating };
};

export default UseQuery;
