import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { ErrorBoundary } from '@sentry/react';
import initSentry from '@/react/common/helpers/Sentry';
import SearchContainer from './containers/SearchContainer';
import ResultsError from '@/react/common/ResultsError';
import { GhostList } from '@/react/common/GhostList';
import AppSettings from './enum/AppSettings';

initSentry();

const ROOT_ID = 'helfi-school-search';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for School search app', { ROOT_ID });
    return;
  }

  ReactDOM.render(
    <React.StrictMode>
      <div className='component--react-search component--react-search--schools'>
        <ErrorBoundary
          fallback={
            <ResultsError error='School search initialization failed' />
          }
        >
          <Suspense fallback={<GhostList count={AppSettings.size} />}>
            <SearchContainer />
          </Suspense>
        </ErrorBoundary>
      </div>
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);
