import { useAtomValue, useSetAtom } from 'jotai';
import { LoadingSpinner } from 'hds-react';
import { SyntheticEvent } from 'react';
import Global from '../enum/Global';
import URLParams from '../types/URLParams';
import { configurationsAtom, pageAtom, setPageAtom, urlAtom } from '../store';
import usePromotedQuery from '../hooks/usePromotedQuery';
import useIndexQuery from '../hooks/useIndexQuery';
import NoResults from '../components/results/NoResults';
import ResultsError from '../components/results/ResultsError';
import IndexFields from '../enum/IndexFields';
import ResultsSort from '../components/results/ResultsSort';
import ResultsCount from '../components/results/ResultsCount';
import ResultsList from '../components/results/ResultsList';
import Pagination from '@/react/common/Pagination';

type PromotedResultsContainerProps = {
  promoted: number[];
}

const PromotedResultsContainer = ({ promoted }: PromotedResultsContainerProps) => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const currentPage = useAtomValue(pageAtom);
  const setPage = useSetAtom(setPageAtom);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const promotedQuery = usePromotedQuery(promoted, urlParams);
  const { data, error } = useIndexQuery({
    query: promotedQuery,
    multi: true
  });

  if (!data && !error) {
    return <LoadingSpinner />;
  }

  if (error || initializationError|| data.error) {
    return <ResultsError error={error||initializationError||data.error} />;
  }

  const [promotedResponse, baseResponse] = data.responses;

  // Typecheck and combine totals from both queries
  const promotedTotal = Number(promotedResponse.aggregations?.total_count?.value);
  const baseTotal = Number(baseResponse.aggregations?.total_count?.value);
  const total = (Number.isNaN(promotedTotal) ? 0 : promotedTotal) + (Number.isNaN(baseTotal)  ? 0 : baseTotal);

  if (total <= 0) {
    return <NoResults />;
  }

  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;

  // Typecheck and combine job totals (aggregated vacancies)
  const promotedJobs = promotedResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
  const baseJobs = baseResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
  const jobs = (Number.isNaN(promotedJobs) ? 0 : promotedJobs) + (Number.isNaN(baseJobs)  ? 0 : baseJobs);

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  const results = [...promotedResponse.hits.hits, ...baseResponse.hits.hits];

  return (
    <div className='job-search__results' id='results-container'>
        <div className='job-search__results-stats'>
          <ResultsCount
            jobs={jobs}
            total={total}
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
    </div>
  );
};

export default PromotedResultsContainer;
