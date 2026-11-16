import { useLayoutEffect, useRef, useState } from 'react';
import ExternalLink from '@/react/common/ExternalLink';
import { getKarttaUrls, type Viewport } from '../helpers/KarttaUrl';

type ResultsMapProps = {
  mapUrls: string[];
};

const RESIZE_DEBOUNCE_MS = 250;

const measure = (element: HTMLElement): Viewport | undefined => {
  const { width, height } = element.getBoundingClientRect();
  return width && height ? { width: Math.round(width), height: Math.round(height) } : undefined;
};

const ResultsMap = ({ mapUrls }: ResultsMapProps) => {
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

  const { embedUrl, url } = getKarttaUrls(mapUrls, drupalSettings?.path?.currentLanguage, viewport);

  return (
    <div className='hdbt-search--react__map-container'>
      <div className='content-list-with-count__result--map' ref={containerRef}>
        {viewport && (
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
