import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { GhostList } from '@/react/common/GhostList';
import initSentry from '@/react/common/helpers/Sentry';
import SearchContainer from './containers/SearchContainer';
import ROOT_ID from './enum/RootId';

const start = () => {
  initSentry(0.05);
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for Events filter', { ROOT_ID });
    return;
  }

  createRoot(rootElement).render(
    <React.StrictMode>
      <Suspense fallback={<GhostList count={30} />}>
        <SearchContainer />
      </Suspense>
    </React.StrictMode>,
  );
};

document.addEventListener('DOMContentLoaded', start);
