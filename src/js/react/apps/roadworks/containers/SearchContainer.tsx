import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';

import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import { roadworksApiUrlAtom } from '../store';
import type Roadwork from '../types/Roadwork';
import ResultsContainer from './ResultsContainer';

const SWR_REFRESH_OPTIONS = {
  refreshInterval: 0,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  errorRetryCount: 3,
};

type ResponseType = {
  data: Roadwork[];
  meta: {
    count: number;
    title?: string;
    see_all_url?: string;
  };
};

const SearchContainer: React.FC = () => {
  const [retriesExhausted, setRetriesExhausted] = useState(false);
  const url = useAtomValue(roadworksApiUrlAtom);

  const getRoadworks = async (reqUrl: string): Promise<ResponseType> => {
    const response = await useTimeoutFetch(reqUrl, undefined, 10000);

    if (response.status === 200) {
      const result = await response.json();

      if (result.meta && result.meta.count >= 0) {
        return result;
      }
    }

    throw new Error('Failed to get roadworks data from the API');
  };

  const shouldFetch = url && url.length > 0;
  const { data, error, isLoading } = useSWR(shouldFetch ? url : null, getRoadworks, {
    ...SWR_REFRESH_OPTIONS,
    onErrorRetry(err, key, config, revalidate, revalidateOpts) {
      if (revalidateOpts.retryCount >= SWR_REFRESH_OPTIONS.errorRetryCount) {
        setRetriesExhausted(true);
        return;
      }

      revalidate({
        ...revalidateOpts
      });
    },
    keepPreviousData: true
  });

  return (
    <ResultsContainer
      countNumber={data?.meta.count || 0}
      error={error}
      roadworks={data?.data || []}
      loading={isLoading}
      retriesExhausted={retriesExhausted}
      seeAllUrl={data?.meta.see_all_url}
    />
  );
};

export default SearchContainer;
