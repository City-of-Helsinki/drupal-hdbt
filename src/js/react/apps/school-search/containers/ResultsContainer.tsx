import { useAtomValue, useSetAtom } from 'jotai';
import { Button, IconMap, IconMenuHamburger, LoadingSpinner } from 'hds-react';
import { SyntheticEvent, useState } from 'react';
import { paramsAtom, updatePageAtom } from '../store';
import useQuery from '../hooks/UseQuery';
import GlobalSettings from '../enum/GlobalSettings';
import ResultCard from '../components/ResultCard';
import Result from '@/types/Result';
import { School } from '../types/School';
import Pagination from '@/react/common/Pagination';
import { AggregationItem } from '@/types/Aggregation';
import bucketToMap from '@/react/common/helpers/Aggregations';

const getMapUrl = (ids?: AggregationItem[]) => {
  const multipleBaseUrl = 'https://palvelukartta.hel.fi/fi/embed/search';
  const singleBaseUrl = 'https://palvelukartta.hel.fi/fi/embed/unit';

  if (!ids) {
    return multipleBaseUrl;
  }

  const idMap = bucketToMap(ids);
  const idArray = Array.from(idMap, (item) => item[0]);

  if (idArray.length === 1) {
    return `${singleBaseUrl}/${idArray[0]}`;
  }

  const mapUrl = new URL(multipleBaseUrl);
  const params = new URLSearchParams();
  params.set('units', idArray.join(','));

  mapUrl.search = params.toString();

  return mapUrl.toString();
};

const ResultsContainer = () => {
  const [useMap, setUseMap] = useState<boolean>(false);
  const { size } = GlobalSettings;
  const params = useAtomValue(paramsAtom);
  const updatePage = useSetAtom(updatePageAtom);
  const { data, error, isLoading, isValidating } = useQuery(params);

  if (isLoading || isValidating) {
    return <LoadingSpinner />;
  }

  // @todo: Implement no results message
  if (!data?.hits?.hits.length || error) {
    return (
      <div className='react-search__no-results'>
        No results
      </div>
    );
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;

  const mapClasses = ['school-search__map-container'];
  const resultsClasses = [];

  if (useMap) {
    resultsClasses.push('is-hidden');
  }
  else {
    mapClasses.push('is-hidden');
  }

  const mapUrl = getMapUrl(data?.aggregations.ids.buckets);
  const showPagination = !useMap && (pages > 1 || addLastPage);

  return (
    <div className='react-search__results'>
      <div className='react-search__result-top-area'>
        <div className='react-search__results-stats'>
          <div className='react-search__count-container'>
            {!Number.isNaN(total) &&
              <> 
                <span className='react-search__count'>{total}</span>
                <span> {Drupal.t('schools', {}, {context: 'School search results statline'})}</span>
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
            Drupal.t('Show schools as a list') :
            Drupal.t('Show schools on map')
          }
        </Button>
      </div>
      <div className={mapClasses.join(' ')}>
        <div className='unit-search__result--map'>
          <iframe
            title="Palvelukartta - Etusivu"
            className="unit-search__map"
            src={mapUrl}
          >
          </iframe>
        </div>
        <div className='unit-search__map-actions'>
          <a
            href={mapUrl}
            className="link"
            data-is-external="true"
          >
            {Drupal.t('Open a larger version of the map')}
            <span className="link__type link__type--external" aria-label={
                Drupal.t('Link leads to external service',
                {},
                {context: 'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.'}
              )}
            ></span>
          </a>
        </div>
      </div>
      <div className={resultsClasses.join(' ')}>
        {results.map((hit: Result<School>) => (
            <ResultCard key={hit._id} {...hit._source} />
          ))
        }
      </div>
      {
        showPagination &&
        <Pagination
          currentPage={params.page || 1}
          pages={5}
          totalPages={addLastPage ? pages + 1 : pages}
          updatePage={(e: SyntheticEvent, page: number) => {
            e.preventDefault();
            updatePage(page);
          }}  
        />
      }
    </div>
  );
};

export default ResultsContainer;