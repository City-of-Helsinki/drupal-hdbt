import { SyntheticEvent, useState } from 'react';
import { Button, IconMap, IconMenuHamburger, LoadingSpinner } from 'hds-react';
import GlobalSettings from '../enum/GlobalSettings';
import bucketToMap from '@/react/common/helpers/Aggregations';
import { AggregationItem } from '@/types/Aggregation';
import Result from '@/types/Result';
import { School } from '../types/School';
import ResultCard from './ResultCard';
import Pagination from '@/react/common/Pagination';
import CookieComplianceStatement from '@/react/common/CookieComplianceStatement';
import ExternalLink from '@/react/common/ExternalLink';

type ResultsListProps = {
  data: any;
  error: boolean;
  isLoading: boolean;
  isValidating: boolean;
  page?: number;
  updatePage: Function
}

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

const ResultsList = ({ data, error, isLoading, isValidating, page, updatePage }: ResultsListProps) => {
  const [useMap, setUseMap] = useState<boolean>(false);
  const { size } = GlobalSettings;

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

  const mapUrl = getMapUrl(data?.aggregations.ids.buckets);
  const showPagination = !useMap && (pages > 1 || addLastPage);

  const getMap = () => {
    if (Drupal.eu_cookie_compliance && Drupal.eu_cookie_compliance.hasAgreed('preference') && Drupal.eu_cookie_compliance.hasAgreed('statistics')) {
      return (
        <div className='school-search__map-container'>
          <div className='unit-search__result--map'>
            <iframe
              title="Palvelukartta - Etusivu"
              className="unit-search__map"
              src={mapUrl}
            >
            </iframe>
          </div>
          <div className='unit-search__map-actions'>
            <ExternalLink href={mapUrl} title={<span>{Drupal.t('Open large version of the map')}</span>} />
          </div>
        </div>
      );
    }

    const url = new URL(mapUrl);

    return (
      <CookieComplianceStatement
        host={url.host}
        policyUrl={drupalSettings.helfi_school_search.cookie_privacy_url}
        sourceUrl={mapUrl}
      />
    );
  };

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
      {
        useMap ?
          getMap()
        :
          <>
            {results.map((hit: Result<School>) => (
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
