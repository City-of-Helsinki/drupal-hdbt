import { SyntheticEvent, createRef, useState } from 'react';
import { useAtomValue } from 'jotai';

import Result from '@/types/Result';
import Pagination from '@/react/common/Pagination';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsError from '@/react/common/ResultsError';
import ResultsMap from '@/react/common/ResultsMap';
import AppSettings from '../enum/AppSettings';
import { School } from '../types/School';
import ResultCard from './ResultCard';
import { paramsAtom } from '../store';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsSort from '../../district-and-project-search/components/results/ResultsSort';

type ResultsListProps = {
  data: any;
  error: string|Error;
  isLoading: boolean;
  isValidating: boolean;
  page?: number;
  updatePage: Function
}

const ResultsList = ({ data, error, isLoading, isValidating, page, updatePage }: ResultsListProps) => {
  const [useMap, setUseMap] = useState<boolean>(false);
  const { size } = AppSettings;
  const params = useAtomValue(paramsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const choices = Boolean(Object.keys(params).length);
  useScrollToResults(scrollTarget, choices);

  if (isLoading || isValidating) {
    return (
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    );
  }

  if (error) {
    return (
      <ResultsError
        error={error}
        ref={scrollTarget}
      />
    );
  }

  if (!data?.hits?.hits.length) {
    return (
      <div ref={scrollTarget}>
        {Drupal.t('No results were found for the criteria you entered. Try changing your search criteria.', {}, { context: 'React search: no search results' })}
      </div>
    );
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const showPagination = !useMap && (pages > 1 || addLastPage);

  return (
    <div className='react-search__results'>
      <ResultsHeader
        resultText={
          <>
            { Drupal.formatPlural(total, '1 school', '@count schools',{},{context: 'React search: schools result count'}) }
          </>
        }
        actions={
          <div className='hdbt-search--react__results--tablist' role='tablist'>
            <button type='button' className='tablist-tab' role='tab' aria-selected={!useMap} aria-controls='hdbt-search--react__results--tabpanel' onClick={() => setUseMap(false)}>
              { Drupal.t('View as a list', {}, {context: 'React search: result display'}) }
            </button>
            <button type='button' className='tablist-tab' role='tab' aria-selected={useMap} aria-controls='hdbt-search--react__results--tabpanel' onClick={() => setUseMap(true)}>
              { Drupal.t('View in a map', {}, {context: 'React search: result display'}) }
            </button>
          </div>
        }
        actionsClass="hdbt-search--react__results--sort"
        ref={scrollTarget}
      />
      <div id='hdbt-search--react__results--tabpanel' role="tabpanel">
        {
          useMap ?
            <ResultsMap ids={data?.aggregations?.ids?.buckets} />
          :
            <>
              {results.map((hit: Result<School>) => (
                <ResultCard key={hit._id} {...hit._source} />
              ))}
            </>
        }
        {
          showPagination &&
          <Pagination
            currentPage={page || 1}
            pages={5}
            totalPages={addLastPage ? pages + 1 : pages}
            updatePage={(e: SyntheticEvent, nextPage: number) => {
              e.preventDefault();
              updatePage(nextPage);
            }}
          />
        }
      </div>
    </div>
  );
};

export default ResultsList;
