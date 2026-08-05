import React from 'react';
import { createRoot } from 'react-dom/client';

import initSentry from '@/react/common/helpers/Sentry';
import SearchContainer from './containers/SearchContainer';

initSentry();

const ROOT_ID = 'helfi-ploughing-schedule';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for Ploughing schedule app', { ROOT_ID });
    return;
  }

  createRoot(rootElement).render(
    <React.StrictMode>
      <SearchContainer />
    </React.StrictMode>,
  );
};

document.addEventListener('DOMContentLoaded', start);
