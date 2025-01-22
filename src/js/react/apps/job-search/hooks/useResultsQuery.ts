import { useAtomValue } from 'jotai';

import URLParams from '../types/URLParams';
import {configurationsAtom} from '../store';
import useQueryString from './useQueryString';
import usePromotedQuery from './usePromotedQuery';
import IndexFields from '../enum/IndexFields';

type HandleQueryResults = (data: any) => { jobs: any, results: any, total: any }

const handlePromotedResults: HandleQueryResults = (data) => {
  const [promotedResponse, baseResponse] = data.responses;

  // Typecheck and combine totals from both queries
  const promotedTotal = Number(promotedResponse.aggregations?.total_count?.value);
  const baseTotal = Number(baseResponse.aggregations?.total_count?.value);
  const total = (Number.isNaN(promotedTotal) ? 0 : promotedTotal) + (Number.isNaN(baseTotal)  ? 0 : baseTotal);

  if (total <= 0) {
    return { results: null, jobs: null, total };
  }

  // Typecheck and combine job totals (aggregated vacancies)
  const promotedJobs = promotedResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
  const baseJobs = baseResponse.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
  const jobs: string = (Number.isNaN(promotedJobs) ? 0 : promotedJobs) + (Number.isNaN(baseJobs)  ? 0 : baseJobs);
  const results = [...promotedResponse.hits.hits, ...baseResponse.hits.hits];

  return {
    results,
    jobs,
    total,
  };
};

const handleSimpleResults: HandleQueryResults = (data) => {
  if (!data?.hits?.hits.length) {
    return { results: null, jobs: null, total: 0 };
  }

  const results = data.hits.hits;
  const total = data.aggregations.total_count.value || data.hits.total.value;

  // Total number of available jobs
  const jobs = data?.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;

  return {
    results,
    jobs,
    total
  };
};

const useResultsQuery = (urlParams: URLParams) => {
  const { promoted } = useAtomValue(configurationsAtom);
  const query = useQueryString(urlParams);
  const promotedQuery = usePromotedQuery(query, urlParams);

  return {
    promoted: !!promoted,
    query: promoted ? promotedQuery : query,
    handleResults: promoted ? handlePromotedResults : handleSimpleResults
  };
};

export default useResultsQuery;
