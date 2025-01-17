import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import initSentry from '@/react/common/helpers/Sentry';
import ResultsContainer from './containers/ResultsContainer';
import FormContainer from './containers/FormContainer';

initSentry();

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  const hideForm = drupalSettings?.helfi_news_archive?.hide_form ?? false;
  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={
        <div className='hdbt__loading-wrapper'>
          <LoadingOverlay />
        </div>
      }>
        {hideForm || <FormContainer />}
        <ResultsContainer />
      </Suspense>
    </React.StrictMode>,
    rootElement
  );
}
