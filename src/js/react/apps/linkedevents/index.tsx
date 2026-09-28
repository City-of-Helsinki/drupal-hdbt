import { Provider } from 'jotai';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import initSentry from '@/react/common/helpers/Sentry';
import { EventsGhostList } from './components/EventsGhostList';
import SearchContainer from './containers/SearchContainer';
import { EVENTS_ROOT_SELECTOR } from './enum/RootId';
import { readEventListConfig } from './helpers/ReadEventListConfig';
import { createEventsStore } from './store';

initSentry(0.05);

const start = () => {
  const rootElements = document.querySelectorAll<HTMLElement>(EVENTS_ROOT_SELECTOR);

  if (!rootElements.length) {
    console.warn('Root element missing for Events filter', { EVENTS_ROOT_SELECTOR });
    return;
  }

  rootElements.forEach((rootElement, index) => {
    const config = readEventListConfig(rootElement, { index, search: window.location.search });

    if (!config) {
      return;
    }

    const { eventCount, layout } = config.settings;

    createRoot(rootElement).render(
      <React.StrictMode>
        <Provider store={createEventsStore(config)}>
          <Suspense fallback={<EventsGhostList count={eventCount} isLifts={layout === 'lifts'} />}>
            <SearchContainer />
          </Suspense>
        </Provider>
      </React.StrictMode>,
    );
  });
};

document.addEventListener('DOMContentLoaded', start);
