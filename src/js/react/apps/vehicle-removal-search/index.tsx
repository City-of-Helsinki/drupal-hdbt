import React from 'react';
import ReactDOM from 'react-dom';

import initSentry from '@/react/common/helpers/Sentry';
import { ErrorBoundary } from '@sentry/react';
import ResultsError from '@/react/common/ResultsError';
import SearchContainer from './containers/SearchContainer';

initSentry();

const rootSelector: string = 'helfi-vehicle-removal-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary fallback={<ResultsError />}>
        <SearchContainer />
      </ErrorBoundary>
    </React.StrictMode>,
    rootElement,
  );
}
