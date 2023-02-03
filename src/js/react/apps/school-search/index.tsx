import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { LoadingSpinner } from 'hds-react';
import ResultsContainer from './containers/ResultsContainer';

const ROOT_ID = 'helfi-school-search';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for School search app', { ROOT_ID });
    return;
  }

  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<LoadingSpinner />}>
        <ResultsContainer />
      </Suspense>
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);
