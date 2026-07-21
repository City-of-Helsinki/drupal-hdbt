import { ErrorBoundary } from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import initSentry from '@/react/common/helpers/Sentry';
import ResultsError from '@/react/common/ResultsError';
import SearchContainer from './containers/SearchContainer';

initSentry();

const rootSelector: string = 'helfi-vehicle-removal-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary fallback={<ResultsError />}>
        <SearchContainer />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
