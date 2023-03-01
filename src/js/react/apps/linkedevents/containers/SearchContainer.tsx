import React, { Suspense } from 'react';
import useSWR from 'swr';
import { useAtomValue, useAtom } from 'jotai';
import ResultsContainer from './ResultsContainer';
import type Event from '../types/Event';
import { initialUrlAtom, urlAtom, initialParamsAtom, paramsAtom } from '../store';
import removeHdsNormalizeStyleElementFromDom from '@/react/common/hooks/removeHdsNormalizeStyleElementFromDom';

const FormContainer = React.lazy(() => import('./FormContainer'));

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
  const initialUrl = useAtomValue(initialUrlAtom);
  const initialParams = useAtomValue(initialParamsAtom);
  const [params, setParams] = useAtom(paramsAtom);
  const url = useAtomValue(urlAtom) || initialUrl;

  if (!params.toString()) {
    setParams(new URLSearchParams(initialParams.toString()));
  }

  removeHdsNormalizeStyleElementFromDom();

  const getEvents = async (reqUrl: string): Promise<ResponseType | null> => {
    const response = await fetch(reqUrl);

    if (response.status === 200) {
      const result = await response.json();

      if (result.meta && result.meta.count >= 0) {
        return result;
      }
    }

    throw new Error('Failed to get data from the API');
  };
  const { data, error } = useSWR(url, getEvents, SWR_REFRESH_OPTIONS);
  const loading = !error && !data;

  return (
    <>
      <Suspense fallback="...loading">
        <FormContainer />
      </Suspense>
      <ResultsContainer error={error} count={data?.meta.count || 0} loading={loading} events={data?.data || []} />
    </>
  );
};

export default SearchContainer;
