import { Notification } from 'hds-react';
import { useAtomValue } from 'jotai';
import { useLayoutEffect, useRef, useState } from 'react';
import ExternalLink from '@/react/common/ExternalLink';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsError from '@/react/common/ResultsError';
import { getKarttaUrls, type Viewport } from '../helpers/KarttaUrl';
import useMapResults from '../hooks/useMapResults';
import { submittedStateAtom } from '../store';

const RESIZE_DEBOUNCE_MS = 250;

const measure = (element: HTMLElement): Viewport | undefined => {
  const { width, height } = element.getBoundingClientRect();
  return width && height ? { width: Math.round(width), height: Math.round(height) } : undefined;
};

const ResultsMap = () => {
  const { results, complete, error, isLoading } = useMapResults();
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

  const { streets, postalCodes, parkingZones } = useAtomValue(submittedStateAtom);
  const { embedUrl, url, filtered } = getKarttaUrls(results, drupalSettings?.path?.currentLanguage, viewport, complete);

  const hasFilters = Boolean(streets.length || postalCodes.length || parkingZones.length);
  const showsAllNotices = !isLoading && !filtered && hasFilters;

  if (error) {
    return <ResultsError error={error} />;
  }

  return (
    <div className='hdbt-search--react__map-container'>
      {showsAllNotices && (
        <Notification
          type='info'
          headingLevel={4}
          label={Drupal.t('The map shows all vehicle removal requests', {}, { context: 'Vehicle removal search' })}
        >
          {Drupal.t(
            'Your search has too many results to show only them on the map. Narrow down your search to see only your results on the map.',
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
