import { useAtomValue } from 'jotai';

import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import getScheduleCard from '../helpers/GetScheduleCard';
import { paramsAtom } from '../store';
import ResultCard from './ResultCard';

type ResultsListProps = {
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  data: any;
  error: string | Error;
  isValidating: boolean;
  queryString: string;
};

const ResultsList = ({ data, error, isValidating, queryString }: ResultsListProps) => {
  const params = useAtomValue(paramsAtom);
  const { scrollTarget, loadingHeaderRef, isSearching } = useSearchFocusManagement(
    isValidating,
    queryString,
    data,
    error,
    params,
  );

  if (isSearching) {
    return (
      // Different keys force React to fully replace the DOM between ghost and results
      // instead of patching in place, which prevents a removeChild crash in React version 17.
      <div key='ghost' className='hdbt__loading-wrapper'>
        <ResultsHeader
          resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
          ref={loadingHeaderRef}
        />
        <LoadingOverlay />
      </div>
    );
  }

  if (error) {
    return <ResultsError error={error} ref={scrollTarget} />;
  }

  const results = data.hits.hits;
  const several = results.length > 1;
  const address = params.address?.replace(/^(?![A-Za-z]\d+$)(.*?)(\s*\d+\w?)$/, '$1') ?? '';

  return (
    <div key='results' className='hdbt-search--react__results'>
      {results.length ? (
        <ResultCard
          {...getScheduleCard(results[0]._source.maintenance_class, several)}
          address={address}
          ref={scrollTarget}
        />
      ) : (
        <ResultCard {...getScheduleCard(0)} ref={scrollTarget} />
      )}
    </div>
  );
};

export default ResultsList;
