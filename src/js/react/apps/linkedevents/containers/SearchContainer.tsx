import useSWR from 'swr';
import { useAtomValue } from 'jotai';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import type Event from '../types/Event';
import { initialUrlAtom, queryBuilderAtom, urlAtom } from '../store';

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
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const initialUrl = useAtomValue(initialUrlAtom);
  const url = useAtomValue(urlAtom) || initialUrl;

  if (!queryBuilder) {
    return null;
  }

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
      <FormContainer />
      <ResultsContainer error={error} count={data?.meta.count || 0} loading={loading} events={data?.data || []} />
    </>
  );
};

export default SearchContainer;
