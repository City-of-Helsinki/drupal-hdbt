import bucketToMap from '@/react/common/helpers/Aggregations';
import CookieComplianceStatement from '@/react/common/CookieComplianceStatement';
import ExternalLink from '@/react/common/ExternalLink';
import { AggregationItem } from '@/types/Aggregation';

type ResultsMapProps = {
  ids?: AggregationItem[]
}

const ID_THRESHOLD = 90;

const ResultsMap = ({ ids }: ResultsMapProps) => {
  const multipleBaseUrl = 'https://palvelukartta.hel.fi/fi/embed/search';
  const singleBaseUrl = 'https://palvelukartta.hel.fi/fi/embed/unit';

  const getMapUrl = () => {
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

    if (idArray.length > ID_THRESHOLD) {
      params.set('service_node', '1100,1110,11187');
      params.set('city', 'helsinki');
      mapUrl.search = params.toString();

      return mapUrl.toString();
    }

    params.set('units', idArray.join(','));
    mapUrl.search = params.toString();

    return mapUrl.toString();
  };

  const mapUrl = getMapUrl();

  if (Drupal.eu_cookie_compliance && Drupal.eu_cookie_compliance.hasAgreed('preference') && Drupal.eu_cookie_compliance.hasAgreed('statistics')) {
    return (
      <div className='hdbt-search--react__map-container'>
        <div className='unit-search__result--map'>
          <iframe
            title='Palvelukartta - Etusivu'
            className='unit-search__map'
            src={mapUrl}
          >
          </iframe>
        </div>
        <div className='unit-search__map-actions'>
          <ExternalLink href={mapUrl} title={<span>{Drupal.t('Open large version of the map', {}, {context: 'React search: result display'})}</span>} />
        </div>
      </div>
    );
  }

  const url = new URL(mapUrl);

  // @todo UHF-10862 Remove policyUrl fallback once the HDBT cookie banner module is in use.
  return (
    <CookieComplianceStatement
      host={url.host}
      policyUrl={drupalSettings.hdbt_cookie_banner.settingsPageUrl || drupalSettings.helfi_react_search.cookie_privacy_url}
      sourceUrl={mapUrl}
    />
  );
};

export default ResultsMap;
