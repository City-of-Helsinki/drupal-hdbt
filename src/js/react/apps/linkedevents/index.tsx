import { getDefaultStore } from 'jotai';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import initSentry from '@/react/common/helpers/Sentry';
import { EventsGhostList } from './components/EventsGhostList';
import SearchContainer from './containers/SearchContainer';
import ROOT_ID from './enum/RootId';
import { settingsAtom } from './store';

const start = () => {
  initSentry(0.05);
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for Events filter', { ROOT_ID });
    return;
  }
  const { eventCount, layout } = getDefaultStore().get(settingsAtom);
  const isLifts = layout === 'lifts';

  createRoot(rootElement).render(
    <React.StrictMode>
      <Suspense fallback={<EventsGhostList count={eventCount} isLifts={isLifts} />}>
        <SearchContainer />
      </Suspense>
    </React.StrictMode>,
  );
};

document.addEventListener('DOMContentLoaded', start);
