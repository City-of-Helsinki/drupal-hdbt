import { Suspense } from 'react';

import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import { GhostList } from '@/react/common/GhostList';
import GlobalSettings from '../enum/Global';
import { useAtomValue, useSetAtom } from 'jotai';
import { configurationsAtom, getElasticUrlAtom, initializeSearchAtom } from '../store';
import Global from '../enum/Global';
import {
  AGGREGATIONS,
  EMPLOYMENT_FILTER_OPTIONS,
  LANGUAGE_OPTIONS,
  PROMOTED_IDS,
  TASK_AREA_OPTIONS,
} from '../query/queries';
import timeoutFetch from '@/react/common/helpers/TimeoutFetch';
import useSWRImmutable from 'swr/immutable';

const aggsQuery = [
  {},
  AGGREGATIONS,
  {},
  TASK_AREA_OPTIONS,
  {},
  EMPLOYMENT_FILTER_OPTIONS,
  {},
  LANGUAGE_OPTIONS,
  {},
  PROMOTED_IDS,
]
  .map((queryPart) => JSON.stringify(queryPart))
  .join('\n')
  .concat('\n');

const SearchContainer = () => {
  const configurations = useAtomValue(configurationsAtom);
  const initializeSearch = useSetAtom(initializeSearchAtom);
  const proxyUrl = useAtomValue(getElasticUrlAtom);
  const { index } = Global;
  const fetcher = async () => {
    const response = await timeoutFetch(`${proxyUrl}/${index}/_msearch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: aggsQuery,
    });

    if (!response.ok) {
      throw new Error(`Error fetching aggregations: ${response.statusText}`);
    }

    const results = await response.json();
    const responses = results.responses;

    if (!responses || !Array.isArray(responses)) {
      throw new Error('Invalid response format from ElasticSearch');
    }

    const [aggs, taskAreas, employmentOptions, languages, promoted] = responses;

    return {
      taskAreaOptions: taskAreas?.hits?.hits || [],
      taskAreas: aggs?.aggregations?.occupations?.buckets || [],
      employment: aggs?.aggregations?.employment?.buckets || [],
      employmentOptions: employmentOptions?.hits?.hits || [],
      employmentSearchIds: aggs?.aggregations?.employment_search_id?.buckets || [],
      employmentType: aggs?.aggregations?.employment_type?.buckets || [],
      languages: languages?.aggregations?.languages?.buckets || [],
      promoted: promoted?.aggregations?.promoted?.buckets || [],
    };
  };

  const { data, error, isLoading, isValidating } = useSWRImmutable(aggsQuery, fetcher);

  if (!isLoading && !isValidating && error) {
    throw error;
  }

  if (data && !configurations) {
    initializeSearch(data);
  }

  if (isLoading || isValidating) {
    return null;
  }

  return (
    <div className='recruitment-search'>
      {/* For async atoms that need to load option values from elastic */}
      <Suspense fallback={<GhostList count={GlobalSettings.size} />}>
        <FormContainer />
        {!drupalSettings?.helfi_rekry_job_search?.results_page_path && <ResultsContainer />}
      </Suspense>
    </div>
  );
};

export default SearchContainer;
