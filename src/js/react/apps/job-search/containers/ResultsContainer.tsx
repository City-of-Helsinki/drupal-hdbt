import { useAtomValue, useSetAtom } from 'jotai';
import { createRef, type SyntheticEvent } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultWrapper from '@/react/common/ResultWrapper';
import ResultsList from '../components/results/ResultsList';
import ResultsSort from '../components/results/ResultsSort';
import Global from '../enum/Global';
import useIndexQuery from '../hooks/useIndexQuery';
import useResultsQuery from '../hooks/useResultsQuery';
import { configurationsAtom, pageAtom, setPageAtom, urlAtom } from '../store';
import type URLParams from '../types/URLParams';
import SearchMonitorContainer from './SearchMonitorContainer';

const ResultsContainer = () => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const currentPage = useAtomValue(pageAtom);
  const setPage = useSetAtom(setPageAtom);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const { query, promoted, handleResults } = useResultsQuery(urlParams);

  const { data, error, isLoading, isValidating } = useIndexQuery({ keepPreviousData: true, query, multi: promoted });

  // Scroll to results when they change.
  const choices = Boolean(Object.keys(urlParams).length);
  const shouldScrollOnRender = Boolean(choices && !isLoading && !isValidating);
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

    if (error || initializationError || data?.error) {
      return (
        <ResultsError
          error={error || initializationError || data.error}
          className='react-search__results'
          ref={scrollTarget}
        />
      );
    }

    const { results, jobs, total } = handleResults(data || {});

    if (total <= 0) {
      return <ResultsEmpty wrapperClass='hdbt-search--react__results--container' ref={scrollTarget} />;
    }

    const pages = Math.ceil(total / size);

    return (
      <>
        <ResultsHeader
          resultText={
            // biome-ignore lint/complexity/noUselessFragments: @todo UHF-12501
            <>
              {Drupal.formatPlural(
                jobs,
                '1 open position',
                '@count open positions',
                {},
                { context: 'Job search results statline' },
              )}
            </>
          }
          optionalResultsText={
            // biome-ignore lint/complexity/noUselessFragments: @todo UHF-12501
            <>
              {Drupal.formatPlural(
                total,
                '1 job listing',
                '@count job listings',
                {},
                { context: 'Job search results statline' },
              )}
            </>
          }
          actions={<ResultsSort />}
          actionsClass='hdbt-search--react__results--sort'
          ref={scrollTarget}
        />
        <ResultsList hits={results} />
        {pages > 1 && <Pagination currentPage={currentPage} pages={5} totalPages={pages} updatePage={updatePage} />}
      </>
    );
  };

  return (
    <>
      {drupalSettings?.helfi_react_search?.hakuvahti_url_set && <SearchMonitorContainer />}
      <div className='job-search__results'>
        <ResultWrapper loading={isLoading || isValidating}>{getResults()}</ResultWrapper>
      </div>
    </>
  );
};

export default ResultsContainer;
