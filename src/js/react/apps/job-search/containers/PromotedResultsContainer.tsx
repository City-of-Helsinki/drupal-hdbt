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
import IndexFields from '../enum/IndexFields';
import ResultsSort from '../components/results/ResultsSort';
import ResultsList from '../components/results/ResultsList';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';

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
    const totalNumber = (Number.isNaN(promotedTotal) ? 0 : promotedTotal) + (Number.isNaN(baseTotal)  ? 0 : baseTotal);
    const total = totalNumber.toString();

    if (totalNumber <= 0) {
      return <ResultsEmpty wrapperClass='hdbt-search--react__results--container' ref={scrollTarget} />;
    }

    const pages = Math.floor(totalNumber / size);
    const addLastPage = totalNumber > size && totalNumber % size;

    // Typecheck and combine job totals (aggregated vacancies)
    const promotedJobs = promotedResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
    const baseJobs = baseResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
    const jobs: string = (Number.isNaN(promotedJobs) ? 0 : promotedJobs) + (Number.isNaN(baseJobs)  ? 0 : baseJobs);
    const results = [...promotedResponse.hits.hits, ...baseResponse.hits.hits];

    return (
      <>
        <ResultsHeader
          resultText={
            <>
              { Drupal.formatPlural(jobs, '1 open position', '@count open positions',{},{ context: 'Job search results statline' }) }
            </>
          }
          optionalResultsText={
            <>
              { Drupal.formatPlural(total, '1 job listing', '@count job listings',{},{context: 'Job search results statline'}) }
            </>
          }
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

  return (
    <div className='job-search__results'>
      <ResultWrapper loading={isLoading || isValidating}>
        {getResults()}
      </ResultWrapper>
    </div>
  );
};

export default PromotedResultsContainer;
