import useSWR from 'swr';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useEffect, useState } from 'react';
import ResultsContainer from './ResultsContainer';
import FormContainer from './FormContainer';
import type Event from '../types/Event';
import { useFixturesAtom, settingsAtom, loadableUrlAtom, updateUrlAtom } from '../store';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import ApiKeys from '../enum/ApiKeys';

type ResponseType = {
  data: Event[];
  meta: {
    count: number;
    next?: string;
    previous?: string;
  }
};

const SWR_REFRESH_OPTIONS = {
  errorRetryCount: 3,
  revalidateOnMount: true,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 6000000, // 10 minutes,in millis
};

const SearchContainer = () => {
  const [retriesExhausted, setRetriesExhausted] = useState(false);
  const settings = useAtomValue(settingsAtom);
  const [urlData] = useAtom(loadableUrlAtom);
  const fixtureData = useAtomValue(useFixturesAtom) as ResponseType;

  const updateUrl = useSetAtom(updateUrlAtom);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('address')) {
      updateUrl();
    }
  }, []);

  // If we have fixture data set, return that instead of an API call.
  if (fixtureData) {
    return (
      <>
        <FormContainer />
        <ResultsContainer countNumber={fixtureData?.meta.count || 0} loading={false} events={fixtureData?.data || []} />
      </>
    );
  }

  const getEvents = async (reqUrl: string): Promise<ResponseType | null> => {
    const response = await useTimeoutFetch(reqUrl, undefined, 10000);

    if (response.status === 200) {
      const result = await response.json();

      if (result.meta && result.meta.count >= 0) {
        return result;
      }
    }

    throw new Error('Failed to get data from the API');
  };

  
  const shouldFetch = urlData.state === 'hasData' && (!settings.useLocationSearch || urlData.data.includes(ApiKeys.COORDINATES));
  const { data, error, isLoading } = useSWR(shouldFetch ? urlData.data : null, getEvents, {
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
    <>
      <FormContainer />
      <ResultsContainer
        addressRequired={!shouldFetch}
        countNumber={data?.meta.count || 0}
        error={error}
        events={data?.data || []}
        loading={urlData.loading || isLoading}
        retriesExhausted={retriesExhausted}
      />
    </>
  );
};

export default SearchContainer;
