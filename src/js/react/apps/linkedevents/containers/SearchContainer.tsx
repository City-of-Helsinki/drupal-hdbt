import useSWR from 'swr';
import { useAtomValue, useAtom } from 'jotai';

import ResultsContainer from './ResultsContainer';
import FormContainer from './FormContainer';
import type Event from '../types/Event';
import { initialUrlAtom, urlAtom, initialParamsAtom, paramsAtom, useFixturesAtom } from '../store';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';

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
  keepPreviousData: true,
};

const SearchContainer = () => {
  const initialUrl = useAtomValue(initialUrlAtom);
  const initialParams = useAtomValue(initialParamsAtom);
  const [params, setParams] = useAtom(paramsAtom);
  const url = useAtomValue(urlAtom) || initialUrl;
  const fixtureData = useAtomValue(useFixturesAtom) as ResponseType;

  // If we have fixture data set, return that instead of an API call.
  if (fixtureData) {
    return (
      <>
        <FormContainer />
        <ResultsContainer countNumber={fixtureData?.meta.count || 0} loading={false} events={fixtureData?.data || []} />
      </>
    );
  }

  if (!params.toString()) {
    setParams(new URLSearchParams(initialParams.toString()));
  }

  const getEvents = async (reqUrl: string): Promise<ResponseType | null> => {
    const response = await useTimeoutFetch(reqUrl);

    if (response.status === 200) {
      const result = await response.json();

      if (result.meta && result.meta.count >= 0) {
        return result;
      }
    }

    throw new Error('Failed to get data from the API');
  };
  const { data, error, isLoading } = useSWR(url, getEvents, SWR_REFRESH_OPTIONS);

  return (
    <>
      <FormContainer />
      <ResultsContainer error={error} countNumber={data?.meta.count || 0} loading={isLoading} events={data?.data || []} />
    </>
  );
};

export default SearchContainer;
