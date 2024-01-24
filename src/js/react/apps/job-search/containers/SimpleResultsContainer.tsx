import { useAtomValue, useSetAtom } from 'jotai';
import { SyntheticEvent, createRef } from 'react';

import Pagination from '@/react/common/Pagination';
import ResultWrapper from '@/react/common/ResultWrapper';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import ResultsError from '@/react/common/ResultsError';
import URLParams from '../types/URLParams';
import { urlAtom , configurationsAtom, pageAtom, setPageAtom } from '../store';
import useQueryString from '../hooks/useQueryString';
import useIndexQuery from '../hooks/useIndexQuery';
import NoResults from '../components/results/NoResults';
import ResultsSort from '../components/results/ResultsSort';
import ResultsList from '../components/results/ResultsList';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import ResultsHeader from '@/react/common/ResultsHeader';

const SimpleResultsContainer = () => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const query = useQueryString(urlParams);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const setPage = useSetAtom(setPageAtom);
  const currentPage = useAtomValue(pageAtom);
  const scrollTarget = createRef<HTMLDivElement>();

  // Scroll to results when they change.
  const choices = Boolean(Object.keys(urlParams).length);
  useScrollToResults(scrollTarget, choices);

  const { data, error, isLoading, isValidating } = useIndexQuery({
    keepPreviousData: true,
    query
  });

  const getResults = () => {
    if (!data && !error) {
      return;
    }

    if (error || initializationError) {
      return (
        <ResultsError
          error={error || initializationError}
          className='react-search__results'
          ref={scrollTarget}
        />
      );
    }

    if (!data?.hits?.hits.length) {
      return <NoResults ref={scrollTarget} />;
    }

    const results = data.hits.hits;
    const total = data.aggregations.total_count.value || data.hits.total.value;
    const pages = Math.floor(total / size);
    const addLastPage = total > size && total % size;

    // Total number of available jobs
    const jobs = data?.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;

    return (
      <>
        <ResultsHeader
          total={jobs}
          otherTotal={total}
          singular="1 open position"
          plural="@count open positions"
          otherSingular="1 job listing"
          otherPlural="@count job listings"
          translationContext="Job search results statline"
          actions={<ResultsSort />}
          actionsClass="hdbt-search--react__results--sort"
          ref={scrollTarget}
        />
        <ResultsList hits={results} />
        <Pagination
          currentPage={currentPage}
          pages={5}
          totalPages={addLastPage ? pages + 1 : pages}
          updatePage={updatePage}
        />
      </>
    );
  };

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  return (
    <div className='react-search__results'>
      <ResultWrapper loading={isLoading || isValidating}>
        {getResults()}
      </ResultWrapper>
    </div>
  );
};

export default SimpleResultsContainer;
