import { useAtomValue, useSetAtom } from 'jotai';
import { type SyntheticEvent, useRef } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useScrollToFirstItem from '@/react/common/hooks/useScrollToFirstItem';
import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
import Pagination from '@/react/common/Pagination';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultWrapper from '@/react/common/ResultWrapper';
import ResultsList from '../components/results/ResultsList';
import ResultsSort from '../components/results/ResultsSort';
import Global from '../enum/Global';
import useIndexQuery from '../hooks/useIndexQuery';
import useResultsQuery from '../hooks/useResultsQuery';
import { getPageAtom, setPageAtom, submittedStateAtom } from '../store';
import SearchMonitorContainer from './SearchMonitorContainer';

const ResultsContainer = () => {
  const submittedState = useAtomValue(submittedStateAtom);
  const { size } = Global;
  const currentPage = useAtomValue(getPageAtom);
  const setPage = useSetAtom(setPageAtom);
  const dialogTargetRef = useRef<HTMLDivElement>(null);
  const { query, promoted, handleResults } = useResultsQuery();

  const { data, error, isValidating } = useIndexQuery({ keepPreviousData: true, query, multi: promoted });

  const { scrollTarget, loadingHeaderRef, skipResultsFocusRef, isSearching } = useSearchFocusManagement(
    isValidating,
    query,
    data,
    error,
    submittedState,
  );

  const resultsListRef = useRef<HTMLDivElement>(null);
  const scrollToFirstItem = useScrollToFirstItem(resultsListRef, isValidating);

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
    scrollToFirstItem();
    skipResultsFocusRef.current = true;
  };

  if (isSearching) {
    return (
      <div key='ghost' className='job-search__results'>
        <ResultsHeader
          resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
          ref={loadingHeaderRef}
        />
        <GhostList count={size} />
      </div>
    );
  }

  const getResults = () => {
    if (error || data?.error) {
      return <ResultsError error={error || data.error} className='react-search__results' ref={scrollTarget} />;
    }

    const { results, jobs, total } = handleResults(data || {});

    const searcMonitor = drupalSettings?.hakuvahti && <SearchMonitorContainer dialogTargetRef={dialogTargetRef} />;

    if (total <= 0) {
      return (
        <div className='job-search__results'>
          <ResultsHeader
            resultText={Drupal.t('No results', {}, { context: 'Unit search no results title' })}
            leftActions={searcMonitor}
            ref={scrollTarget}
          />
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
          optionalResultsText={Drupal.formatPlural(
            total,
            '1 job listing',
            '@count job listings',
            {},
            { context: 'Job search results statline' },
          )}
          leftActions={searcMonitor}
          resultText={Drupal.formatPlural(
            jobs,
            '1 open position',
            '@count open positions',
            {},
            { context: 'Job search results statline' },
          )}
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
      <div ref={dialogTargetRef} />
      {getResults()}
    </div>
  );
};

export default ResultsContainer;
