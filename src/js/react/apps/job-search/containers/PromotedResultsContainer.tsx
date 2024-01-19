import { useAtomValue, useSetAtom } from 'jotai';
import { SyntheticEvent, createRef } from 'react';

import Pagination from '@/react/common/Pagination';
import ResultWrapper from '@/react/common/ResultWrapper';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import ResultsError from '@/react/common/ResultsError';
import Global from '../enum/Global';
import URLParams from '../types/URLParams';
import { configurationsAtom, pageAtom, setPageAtom, urlAtom } from '../store';
import usePromotedQuery from '../hooks/usePromotedQuery';
import useIndexQuery from '../hooks/useIndexQuery';
import NoResults from '../components/results/NoResults';
import IndexFields from '../enum/IndexFields';
import ResultsSort from '../components/results/ResultsSort';
import ResultsCount from '../components/results/ResultsCount';
import ResultsList from '../components/results/ResultsList';

const PromotedResultsContainer = () => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const currentPage = useAtomValue(pageAtom);
  const setPage = useSetAtom(setPageAtom);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const promotedQuery = usePromotedQuery(urlParams);
  const scrollTarget = createRef<HTMLDivElement>();

  // Scroll to results when they change.
  const choices = Boolean(Object.keys(urlParams).length);
  useScrollToResults(scrollTarget, choices);

  const { data, error, isLoading, isValidating } = useIndexQuery({
    keepPreviousData: true,
    query: promotedQuery,
    multi: true
  });

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  const getResults = () => {
    if (!data && !error) {
      return;
    }

    if (error || initializationError || data.error) {
      return (
        <ResultsError
          error={error || initializationError || data.error}
          className='react-search__results'
          ref={scrollTarget}
        />
      );
    }

    const [promotedResponse, baseResponse] = data.responses;

    // Typecheck and combine totals from both queries
    const promotedTotal = Number(promotedResponse.aggregations?.total_count?.value);
    const baseTotal = Number(baseResponse.aggregations?.total_count?.value);
    const total = (Number.isNaN(promotedTotal) ? 0 : promotedTotal) + (Number.isNaN(baseTotal)  ? 0 : baseTotal);

    if (total <= 0) {
      return <NoResults ref={scrollTarget} />;
    }

    const pages = Math.floor(total / size);
    const addLastPage = total > size && total % size;

    // Typecheck and combine job totals (aggregated vacancies)
    const promotedJobs = promotedResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
    const baseJobs = baseResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
    const jobs = (Number.isNaN(promotedJobs) ? 0 : promotedJobs) + (Number.isNaN(baseJobs)  ? 0 : baseJobs);
    const results = [...promotedResponse.hits.hits, ...baseResponse.hits.hits];

    return (
      <>
        <div className='hdbt-search--react__result-top-area'>
          <ResultsCount
            jobs={jobs}
            total={total}
            ref={scrollTarget}
          />
          <ResultsSort />
        </div>
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

  return (
    <div className='job-search__results'>
      <ResultWrapper loading={isLoading || isValidating}>
        {getResults()}
      </ResultWrapper>
    </div>
  );
};

export default PromotedResultsContainer;
