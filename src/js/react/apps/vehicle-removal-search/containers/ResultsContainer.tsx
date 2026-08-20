import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import useSWR from 'swr';
import SearchStatus from '@/react/common/SearchStatus';
import ResultsList from '../components/ResultsList';
import { getStatusText } from '../helpers/ResultText';
import useVehicleRemovalQuery from '../hooks/useVehicleRemovalQuery';
import { triggerFocusAtom } from '../store';

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

  const focusDeferred = useAtomValue(triggerFocusAtom);
  const total = data?.hits?.total?.value ?? 0;

  return (
    <>
      <SearchStatus announce={focusDeferred} isValidating={isValidating} text={getStatusText(total, error)} />
      <ResultsList {...{ data, error, isLoading, isValidating }} />
    </>
  );
};

export default ResultsContainer;
