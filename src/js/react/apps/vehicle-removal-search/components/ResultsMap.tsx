import { Notification } from 'hds-react';
import { useLayoutEffect, useRef, useState } from 'react';
import ExternalLink from '@/react/common/ExternalLink';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsError from '@/react/common/ResultsError';
import { getKarttaUrls, type Viewport } from '../helpers/KarttaUrl';
import useMapResults from '../hooks/useMapResults';

type ResultsMapProps = {
  // Total number of results in the current search.
  total: number;
};

const RESIZE_DEBOUNCE_MS = 250;

const measure = (element: HTMLElement): Viewport | undefined => {
  const { width, height } = element.getBoundingClientRect();
  return width && height ? { width: Math.round(width), height: Math.round(height) } : undefined;
};

const ResultsMap = ({ total }: ResultsMapProps) => {
  const { mapUrls, fetched, error, isLoading } = useMapResults();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>();

  // Fit the results into the actual size of the map. The iframe only reloads
  // when the size change results in a different zoom level, because the
  // embed URL stays the same otherwise.
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    setViewport(measure(element));

    if (typeof ResizeObserver === 'undefined') return;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeout);
      // Keep the previous size while the map is hidden.
      timeout = setTimeout(() => setViewport((previous) => measure(element) ?? previous), RESIZE_DEBOUNCE_MS);
    });
    observer.observe(element);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  const { embedUrl, url, shown, truncated } = getKarttaUrls(mapUrls, drupalSettings?.path?.currentLanguage, viewport);

  // Only some of the results fit on the map. Results without a map link are
  // not counted here, since narrowing the search would not show them either.
  const limited = !isLoading && !error && (truncated || fetched < total);

  if (error) {
    return <ResultsError error={error} />;
  }

  return (
    <div className='hdbt-search--react__map-container'>
      {limited && (
        <Notification
          type='info'
          headingLevel={4}
          label={Drupal.t(
            'The map shows @shown of @total vehicle removal requests',
            { '@shown': shown, '@total': total },
            { context: 'Vehicle removal search' },
          )}
        >
          {Drupal.t(
            'Narrow down your search to see all of them on the map.',
            {},
            { context: 'Vehicle removal search' },
          )}
        </Notification>
      )}
      <div className='content-list-with-count__result--map' ref={containerRef}>
        {isLoading && <LoadingOverlay />}
        {viewport && !isLoading && (
          <iframe
            title={Drupal.t('Vehicle removal requests on the map', {}, { context: 'Vehicle removal search' })}
            className='content-list-with-count__map'
            src={embedUrl}
          ></iframe>
        )}
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
