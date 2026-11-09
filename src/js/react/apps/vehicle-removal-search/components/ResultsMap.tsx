import ExternalLink from '@/react/common/ExternalLink';
import { getKarttaUrls } from '../helpers/KarttaUrl';

type ResultsMapProps = {
  mapUrls: string[];
};

const ResultsMap = ({ mapUrls }: ResultsMapProps) => {
  const { embedUrl, url } = getKarttaUrls(mapUrls, drupalSettings?.path?.currentLanguage);

  return (
    <div className='hdbt-search--react__map-container'>
      <div className='content-list-with-count__result--map'>
        <iframe
          title={Drupal.t('Vehicle removal requests on the map', {}, { context: 'Vehicle removal search' })}
          className='content-list-with-count__map'
          src={embedUrl}
        ></iframe>
      </div>
      <div className='content-list-with-count__map-actions'>
        <ExternalLink
          href={url}
          title={
            <span>
              {Drupal.t('Open large version of the map', {}, { context: 'Content list with count action link' })}
            </span>
          }
        />
      </div>
    </div>
  );
};

export default ResultsMap;
