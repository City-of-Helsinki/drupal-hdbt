import { SyntheticEvent, createRef, useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';

import Result from '@/types/Result';
import Pagination from '@/react/common/Pagination';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import ResultsError from '@/react/common/ResultsError';
import ResultsMap from '@/react/common/ResultsMap';
import AppSettings from '../enum/AppSettings';
import { School } from '../types/School';
import ResultCard from './ResultCard';
import { paramsAtom } from '../store';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import { GhostList } from '@/react/common/GhostList';
import LoadingOverlay from '@/react/common/LoadingOverlay';

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
  const [wasSubmitted, setWasSubmitted] = useState(false);
  useScrollToResults(scrollTarget, wasSubmitted);

  useEffect(() => {
    if (sessionStorage.getItem('scrollToResults') === 'true') {
      setWasSubmitted(true);
      sessionStorage.removeItem('scrollToResults');
    }
  }, [params]);

  if (isLoading || isValidating) {
    return useMap ?
      <LoadingOverlay /> :
      <GhostList count={size} />;
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
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const showPagination = !useMap && (pages > 1 || addLastPage);

  const resultHeader = Drupal.formatPlural(total, '1 school', '@count schools',{},{context: 'React search: schools result count'});

  return (
    <div className='react-search__results'>
      <ResultsHeader
        resultText={data.addressName ? `${resultHeader} ${Drupal.t('using address', {}, {context: 'School search: result display'})} ${data.addressName}` : resultHeader}
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
              { Drupal.t('View as a list', {}, {context: 'React search: result display'}) }
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
              { Drupal.t('View in a map', {}, {context: 'React search: result display'}) }
            </button>
          </div>
        }
        actionsClass="hdbt-search--react__results--sort"
        ref={scrollTarget}
      />
      <div
        id={`school-search-results-tabpanel-${useMap ? 'map' : 'list'}`}
        role="tabpanel"
        aria-labelledby={`school-search-results-tab-${useMap ? 'map' : 'list'}`}
      >
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
