import ResultsList from '../components/ResultsList';
import useSWR from 'swr';
import { useCallback } from 'react';
import useVehicleRemovalQuery from '../hooks/useVehicleRemovalQuery';

const ResultsContainer = () => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;
  const query = useVehicleRemovalQuery();

  const fetcher = useCallback(
    async (body: string) => {
      const response = await fetch(`${url}/mobilenote_data/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      return response.json();
    },
    [url],
  );

  const { data, error, isLoading, isValidating } = useSWR(query, fetcher, { revalidateOnFocus: false });

  return <ResultsList {...{ data, error, isLoading, isValidating }} />;
};

export default ResultsContainer;
