import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import ApiKeys from '../enum/ApiKeys';
import { loadableUrlAtom, settingsAtom, updateUrlAtom, useFixturesAtom } from '../store';
import type Event from '../types/Event';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import * as Sentry from '@sentry/react';
import timeoutFetch from '@/react/common/helpers/TimeoutFetch';
import { CrossStudiesFormContainer } from '../modules/cross-institution-studies/containers/CrossStudiesFormContainer';
import { ResultCard } from '../modules/cross-institution-studies/components/ResultCard';

type ResponseType = { data: Event[]; meta: { count: number; next?: string; previous?: string } };

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
  const addressInitializationRun = useRef(false);
  const initialStateSet = useRef(false);

  const { useCrossInstitutionalStudiesForm } = settings;

  useEffect(() => {
    if (addressInitializationRun.current) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('address')) {
      updateUrl();
    }
  }, [addressInitializationRun, updateUrl]);

  const setInitialStateInitialized = () => {
    if (initialStateSet.current) return;
    initialStateSet.current = true;
  };

  const getEvents = async (reqUrl: string): Promise<ResponseType | null> => {
    const response = await Sentry.startSpan(
      { name: 'Linkedevents api call', op: 'external.api' },
      async () => await timeoutFetch(reqUrl, undefined, 10000),
    );

    if (response.status === 200) {
      const result = await response.json();

      if (result.meta && result.meta.count >= 0) {
        return result;
      }
    }

    throw new Error('Failed to get data from the API');
  };

  const shouldFetch =
    !fixtureData && urlData.state === 'hasData' && (!settings.useLocationSearch || urlData.data.includes(ApiKeys.COORDINATES));

  const { data, error, isLoading, isValidating } = useSWR(shouldFetch ? urlData.data : null, getEvents, {
    ...SWR_REFRESH_OPTIONS,
    onErrorRetry(_err, _key, _config, revalidate, revalidateOpts) {
      if (revalidateOpts.retryCount >= SWR_REFRESH_OPTIONS.errorRetryCount) {
        setRetriesExhausted(true);
        return;
      }

      revalidate({ ...revalidateOpts });
    },
    keepPreviousData: true,
  });

  // If we have fixture data set, return that instead of an API call.
  if (fixtureData) {
    return (
      <>
        <FormContainer />
        <ResultsContainer
          countNumber={fixtureData?.meta.count || 0}
          loading={false}
          events={fixtureData?.data || []}
          validating={false}
        />
      </>
    );
  }
  
  const loading = (useCrossInstitutionalStudiesForm && !initialStateSet.current) || isLoading || urlData.state === 'loading';

  return (
    <>
      {
        useCrossInstitutionalStudiesForm ?
          <CrossStudiesFormContainer
            initialized={initialStateSet.current}
            initialize={setInitialStateInitialized}
          /> :
          <FormContainer />
      }
      <ResultsContainer
        addressRequired={!shouldFetch}
        countNumber={data?.meta?.count || 0}
        error={error}
        events={data?.data || []}
        loading={loading}
        validating={isValidating}
        ResultCardComponent={(useCrossInstitutionalStudiesForm && ResultCard) || undefined}
        retriesExhausted={retriesExhausted}
      />
    </>
  );
};

export default SearchContainer;
