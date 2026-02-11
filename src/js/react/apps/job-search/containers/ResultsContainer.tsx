import { useAtomValue, useSetAtom } from 'jotai';
import { createRef, type SyntheticEvent } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '@/react/common/Pagination';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultWrapper from '@/react/common/ResultWrapper';
import ResultsList from '../components/results/ResultsList';
import ResultsSort from '../components/results/ResultsSort';
import Global from '../enum/Global';
import useIndexQuery from '../hooks/useIndexQuery';
import useResultsQuery from '../hooks/useResultsQuery';
import { getPageAtom, hasChoicesAtom, setPageAtom } from '../store';
import SearchMonitorContainer from './SearchMonitorContainer';

const ResultsContainer = () => {
  const hasChoices = useAtomValue(hasChoicesAtom);
  const { size } = Global;
  const currentPage = useAtomValue(getPageAtom);
  const setPage = useSetAtom(setPageAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const dialogTargetRef = createRef<HTMLDivElement>();
  const { query, promoted, handleResults } = useResultsQuery();

  const { data, error, isLoading, isValidating } = useIndexQuery({ keepPreviousData: true, query, multi: promoted });

  // Scroll to results when they change.
  const shouldScrollOnRender = Boolean(hasChoices && !isLoading && !isValidating);
  useScrollToResults(scrollTarget, shouldScrollOnRender);

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  const getResults = () => {
    // Show the GhostCards when the search is loading its inital state
    // and when the filters are applied and new results are fetched.
    if (isLoading || isValidating) {
      return <GhostList count={size} />;
    }

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
        <ResultsList hits={results} />
        {pages > 1 && <Pagination currentPage={currentPage} pages={5} totalPages={pages} updatePage={updatePage} />}
      </>
    );
  };

  return (
    <div className='job-search__results'>
      <div ref={dialogTargetRef} />
      <ResultWrapper loading={isLoading || isValidating}>{getResults()}</ResultWrapper>
    </div>
  );
};

export default ResultsContainer;
