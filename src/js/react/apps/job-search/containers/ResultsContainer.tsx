import { useAtomValue, useSetAtom } from 'jotai';
import { type SyntheticEvent, useRef } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
import Pagination from '@/react/common/Pagination';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import SearchStatus from '@/react/common/SearchStatus';
import ResultsList from '../components/results/ResultsList';
import ResultsSort from '../components/results/ResultsSort';
import Global from '../enum/Global';
import { getEmptyResultText, getOptionalResultText, getResultText, getStatusText } from '../helpers/ResultText';
import useIndexQuery from '../hooks/useIndexQuery';
import useResultsQuery from '../hooks/useResultsQuery';
import { deferFocusAtom, getPageAtom, setPageAtom, submittedStateAtom } from '../store';
import SearchMonitorContainer from './SearchMonitorContainer';

const ResultsContainer = () => {
  const submittedState = useAtomValue(submittedStateAtom);
  const { size } = Global;
  const currentPage = useAtomValue(getPageAtom);
  const setPage = useSetAtom(setPageAtom);
  const deferFocus = useAtomValue(deferFocusAtom);
  const dialogTargetRef = useRef<HTMLDivElement>(null);
  const { query, promoted, handleResults } = useResultsQuery();

  const { data, error, isValidating } = useIndexQuery({ keepPreviousData: true, query, multi: promoted });

  const { scrollTarget, loadingHeaderRef, resultsListRef, onPageChange, isSearching } = useSearchFocusManagement(
    isValidating,
    query,
    data,
    error,
    submittedState,
    true,
    deferFocus,
  );

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
    onPageChange();
  };

  const resultsError = error || data?.error;
  const hasResults = Boolean(!resultsError && (promoted ? data?.responses : data?.hits));
  const { results, jobs, total } = hasResults ? handleResults(data) : { results: null, jobs: 0, total: 0 };
  const jobCount = Number(jobs) || 0;

  const getResults = () => {
    if (isSearching) {
      return (
        <>
          <ResultsHeader
            resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
            ref={loadingHeaderRef}
          />
          <GhostList count={size} />
        </>
      );
    }

    if (resultsError) {
      return <ResultsError error={resultsError} className='react-search__results' ref={scrollTarget} />;
    }

    const searcMonitor = drupalSettings?.hakuvahti && <SearchMonitorContainer dialogTargetRef={dialogTargetRef} />;

    if (total <= 0) {
      return (
        <div className='job-search__results'>
          <ResultsHeader resultText={getEmptyResultText()} leftActions={searcMonitor} ref={scrollTarget} />
          <p>
            {Drupal.t(
              'No results were found for the criteria you entered. Try changing your search criteria.',
              {},
              { context: 'React search: no search results' },
            )}
          </p>
        </div>
      );
    }

    const pages = Math.ceil(total / size);

    return (
      <>
        <ResultsHeader
          actions={<ResultsSort />}
          actionsClass='hdbt-search--react__results--sort'
          optionalResultsText={getOptionalResultText(total)}
          leftActions={searcMonitor}
          resultText={getResultText(jobCount)}
          ref={scrollTarget}
        />
        <div ref={resultsListRef}>
          <ResultsList hits={results} />
        </div>
        {pages > 1 && <Pagination currentPage={currentPage} pages={5} totalPages={pages} updatePage={updatePage} />}
      </>
    );
  };

  return (
    <div className='job-search__results'>
      <SearchStatus
        announce={deferFocus}
        isValidating={isValidating}
        text={getStatusText(jobCount, total, resultsError)}
      />
      <div ref={dialogTargetRef} />
      {getResults()}
    </div>
  );
};

export default ResultsContainer;
