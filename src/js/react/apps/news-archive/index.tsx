import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { LoadingSpinner } from 'hds-react';
import ResultsContainer from './containers/ResultsContainer';
import FormContainer from './containers/FormContainer';

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<LoadingSpinner />}>
        <FormContainer />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <ResultsContainer />
      </Suspense>
    </React.StrictMode>,
    rootElement
  );
}
