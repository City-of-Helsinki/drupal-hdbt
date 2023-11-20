import { SyntheticEvent, createRef, useState } from 'react';
import { Tabs } from 'hds-react';
import { useAtomValue } from 'jotai';

import Result from '@/types/Result';
import Pagination from '@/react/common/Pagination';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsError from '@/react/common/ResultsError';
import GlobalSettings from '../enum/GlobalSettings';
import { HealthStation } from '../types/HealthStation';
import ResultCard from './ResultCard';
import ResultsMap from './ResultsMap';
import { paramsAtom } from '../store';

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
  const { size } = GlobalSettings;
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
        {Drupal.t('No results', {}, {context: 'No search results'})}
      </div>
    );
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const showPagination = !useMap && (pages > 1 || addLastPage);

  const tabsTheme = {
    '--tab-color': 'var(--color-black)',
    '--tab-active-border-color': 'var(--color-black)',
  };

  return (
    <div className='react-search__results'>
      <div className='react-search__result-top-area'>
        {!Number.isNaN(total) &&
          <h3 className='react-search__results-title' ref={scrollTarget}>
            { Drupal.formatPlural(total, '1 health station', '@count health stations', {}, {context: 'Health station search: result count'}) }
          </h3>
        }
        <Tabs theme={tabsTheme}>
            <Tabs.TabList>
              <Tabs.Tab onClick={() => setUseMap(false)}>
                { Drupal.t('View as a list', {}, {context: 'Health station search: result display'}) }
              </Tabs.Tab>
              <Tabs.Tab onClick={() => setUseMap(true)}>
                { Drupal.t('View in a map', {}, {context: 'Health station search: result display'}) }
              </Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
      </div>
      {
        useMap ?
          <ResultsMap ids={data?.aggregations?.ids?.buckets} />
        :
          <>
            {results.map((hit: Result<HealthStation>) => (
                <ResultCard key={hit._id} {...hit._source} />
              ))
            }
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
  );
};

export default ResultsList;
