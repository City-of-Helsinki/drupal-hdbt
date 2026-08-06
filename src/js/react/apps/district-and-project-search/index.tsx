import React from 'react';
import { createRoot } from 'react-dom/client';

import initSentry from '@/react/common/helpers/Sentry';
import SearchContainer from './containers/SearchContainer';

initSentry();

const rootSelector: string = 'helfi-kymp-district-project-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <SearchContainer />
    </React.StrictMode>,
  );
}
