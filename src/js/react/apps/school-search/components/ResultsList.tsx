import { useAtomValue } from 'jotai';
import { type SyntheticEvent, useState } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsMap from '@/react/common/ResultsMap';
import type Result from '@/types/Result';
import AppSettings from '../enum/AppSettings';
import { paramsAtom } from '../store';
import type { School } from '../types/School';
import ResultCard from './ResultCard';

type ResultsListProps = {
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  data: any;
  error: string | Error;
  isLoading: boolean;
  isValidating: boolean;
  page?: number;
  queryString: string;
  // biome-ignore lint/complexity/noBannedTypes: @todo UHF-12501
  updatePage: Function;
};

const ResultsList = ({ data, error, isLoading, isValidating, page, queryString, updatePage }: ResultsListProps) => {
  const [useMap, setUseMap] = useState<boolean>(false);
  const { size } = AppSettings;
  const params = useAtomValue(paramsAtom);
  const { scrollTarget, loadingHeaderRef, resultsListRef, onPageChange, isSearching } = useSearchFocusManagement(
    isLoading || isValidating,
    queryString,
    data,
    error,
    params,
  );

  if (isSearching) {
    return (
      // Different keys force React to fully replace the DOM between ghost and results
      // instead of patching in place, which prevents a removeChild crash in React version 17.
      <div key='ghost' className='react-search__results'>
        <ResultsHeader
          resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
          ref={loadingHeaderRef}
        />
        {useMap ? <LoadingOverlay /> : <GhostList count={size} />}
      </div>
    );
  }

  if (error) {
    return <ResultsError error={error} ref={scrollTarget} />;
  }

  if (!data?.hits?.hits.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const showPagination = !useMap && (pages > 1 || addLastPage);

  const resultHeader = Drupal.formatPlural(
    total,
    '1 school',
    '@count schools',
    {},
    { context: 'React search: schools result count' },
  );

  return (
    <div key='results' className='react-search__results'>
      <ResultsHeader
        resultText={
          data.addressName
            ? `${resultHeader} ${Drupal.t('using address', {}, { context: 'React search: Address result display' })} ${data.addressName}`
            : resultHeader
        }
        actions={
          <div className='hdbt-search--react__results--tablist' role='tablist'>
            <button
              id='school-search-results-tab-list'
              type='button'
              className='tablist-tab'
              role='tab'
              aria-selected={!useMap}
              aria-controls='school-search-results-tabpanel-list'
              onClick={() => setUseMap(false)}
            >
              {Drupal.t('View as a list', {}, { context: 'Content list with count list tab text' })}
            </button>
            <button
              id='school-search-results-tab-map'
              type='button'
              className='tablist-tab'
              role='tab'
              aria-selected={useMap}
              aria-controls='school-search-results-tabpanel-map'
              onClick={() => setUseMap(true)}
            >
              {Drupal.t('View in a map', {}, { context: 'Content list with count map tab text' })}
            </button>
          </div>
        }
        actionsClass='hdbt-search--react__results--sort'
        ref={scrollTarget}
      />
      <div
        id={`school-search-results-tabpanel-${useMap ? 'map' : 'list'}`}
        role='tabpanel'
        aria-labelledby={`school-search-results-tab-${useMap ? 'map' : 'list'}`}
      >
        {useMap ? (
          <ResultsMap ids={data?.aggregations?.ids?.buckets} />
        ) : (
          <div ref={resultsListRef}>
            {results.map((hit: Result<School>) => (
              <ResultCard key={hit._id} {...hit._source} />
            ))}
          </div>
        )}
        {showPagination && (
          <Pagination
            currentPage={page || 1}
            pages={5}
            totalPages={addLastPage ? pages + 1 : pages}
            updatePage={(e: SyntheticEvent, nextPage: number) => {
              e.preventDefault();
              updatePage(nextPage);
              onPageChange();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsList;
