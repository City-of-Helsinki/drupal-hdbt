import type {
  AggregationsValueCountAggregate,
  MsearchResponse,
  SearchHit,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { useAtomValue } from 'jotai';
import IndexFields from '../enum/IndexFields';
import { configurationsAtom, submittedStateAtom } from '../store';
import type Job from '../types/Job';
import type { Result } from '../types/Result';
import usePromotedQuery from './usePromotedQuery';
import useQueryString from './useQueryString';

type HandlerResponse = { jobs: number; results: Result<Job>[]; total: number };
type ResultsAggregations = Record<string, AggregationsValueCountAggregate> & {
  total_count: AggregationsValueCountAggregate;
};

const handlePromotedResults = (data: MsearchResponse<Job, ResultsAggregations>): HandlerResponse => {
  let total = 0;
  let jobs = 0;
  let results: SearchHit<Job>[] = [];

  const responseIds = ['promotions', 'base'];

  for (const [index, response] of data.responses.entries()) {
    if ('error' in response) {
      console.error(`Failed to fetch data for ${responseIds[index]}`, response);
      continue;
    }

    const aggregations = response.aggregations as ResultsAggregations;

    total += aggregations?.total_count.value || 0;
    jobs += aggregations?.[IndexFields.NUMBER_OF_JOBS].value || 0;
    results = [...results, ...response.hits.hits];
  }

  if (total <= 0) {
    return { results: [], jobs: 0, total };
  }

  return { results: results as Result<Job>[], jobs, total };
};

const handleSimpleResults = (data: SearchResponse<Job, ResultsAggregations>): HandlerResponse => {
  if (!data?.hits?.hits.length) {
    return { results: [], jobs: 0, total: 0 };
  }

  const results = data.hits.hits;
  const hitsTotal = data.hits.total;
  const total: number =
    data.aggregations?.total_count.value || (typeof hitsTotal === 'number' ? hitsTotal : hitsTotal?.value) || 0;

  const jobs = data?.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value || 0;

  return { results: results as Result<Job>[], jobs, total };
};

export const useResultsQuery = () => {
  const submittedState = useAtomValue(submittedStateAtom);
  const { promoted } = useAtomValue(configurationsAtom) || {};
  const query = useQueryString();
  const promotedQuery = usePromotedQuery(query, submittedState);

  return {
    promoted: !!promoted,
    query: promoted ? promotedQuery : query,
    handleResults: promoted ? handlePromotedResults : handleSimpleResults,
  };
};
