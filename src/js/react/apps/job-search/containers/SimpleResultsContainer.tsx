import { useAtomValue, useSetAtom } from 'jotai';
import { LoadingSpinner } from 'hds-react';
import { SyntheticEvent, createRef, useEffect } from 'react';
import URLParams from '../types/URLParams';
import { urlAtom , configurationsAtom, pageAtom, setPageAtom } from '../store';
import useQueryString from '../hooks/useQueryString';
import useIndexQuery from '../hooks/useIndexQuery';
import ResultsCount from '../components/results/ResultsCount';
import NoResults from '../components/results/NoResults';
import ResultsError from '../components/results/ResultsError';
import ResultsSort from '../components/results/ResultsSort';
import Pagination from '@/react/common/Pagination';
import ResultsList from '../components/results/ResultsList';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import ResultWrapper from '@/react/common/ResultWrapper';

const SimpleResultsContainer = () => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const query = useQueryString(urlParams);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const setPage = useSetAtom(setPageAtom);
  const currentPage = useAtomValue(pageAtom);
  const scrollTarget = createRef<HTMLDivElement>();

  // Scroll to results when they change.
  const choices = Object.keys(urlParams).length;
  useEffect(() => {
    if (scrollTarget?.current && choices) {
      scrollTarget.current.tabIndex = -1;
      scrollTarget.current.focus();
      scrollTarget.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [choices, scrollTarget]);

  const { data, error, isLoading, isValidating } = useIndexQuery({
    keepPreviousData: true,
    query
  });

  const getResults = () => {
    if (!data && !error) {
      return;
    }
  
    if (!data?.hits?.hits.length) {
      return <NoResults />;
    }
  
    if (error || initializationError) {
      return <ResultsError {...{error, initializationError}}/>;
    }
  
    const results = data.hits.hits;
    const total = data.aggregations.total_count.value || data.hits.total.value;
    const pages = Math.floor(total / size);
    const addLastPage = total > size && total % size;

    // Total number of available jobs
    const jobs: number = data?.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;

    return (
      <>
        <div className='job-search__results-stats'>
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

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  return (
    <div className='job-search__results'>
      <ResultWrapper loading={isLoading || isValidating}>
        {getResults()}
      </ResultWrapper>
    </div>
  );
};

export default SimpleResultsContainer;
