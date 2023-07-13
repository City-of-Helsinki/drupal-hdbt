import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ResultsContainer from './containers/ResultsContainer';
import FormContainer from './containers/FormContainer';
import LoadingOverlay from '@/react/common/LoadingOverlay';

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={
        <div className='hdbt__loading-wrapper'>
          <LoadingOverlay />
        </div>
      }>
        <FormContainer />
        <ResultsContainer />
        </Suspense>
    </React.StrictMode>,
    rootElement
  );
}
