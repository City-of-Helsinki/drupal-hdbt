import { SyntheticEvent, createRef, useState } from 'react';
import { Button, IconMap, IconMenuHamburger } from 'hds-react';
import { useAtomValue } from 'jotai';

import Result from '@/types/Result';
import Pagination from '@/react/common/Pagination';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsError from '@/react/common/ResultsError';
import GlobalSettings from '../enum/GlobalSettings';
import { School } from '../types/School';
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

  return (
    <div className='react-search__results'>
      <div className='react-search__result-top-area'>
        <div className='react-search__results-stats'>
          <div className='react-search__count-container' ref={scrollTarget}>
            {!Number.isNaN(total) &&
              <>
                <span className='react-search__count'>{total}</span>
                <span> {Drupal.t('schools', {}, {context: 'School search: results statline'})}</span>
              </>
            }
          </div>
        </div>
        <Button
          onClick={() => setUseMap(!useMap)}
          iconRight={useMap ? <IconMenuHamburger /> : <IconMap />}
          theme='black'
          type='button'
          variant='secondary'
        >
          {useMap ?
            Drupal.t('Show schools as a list', {}, {context: 'School search: result display'}) :
            Drupal.t('Show the schools on a map', {}, {context: 'School search: result display'})
          }
        </Button>
      </div>
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
  );
};

export default ResultsList;
