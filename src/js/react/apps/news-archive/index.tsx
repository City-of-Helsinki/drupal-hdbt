import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import initSentry from '@/react/common/helpers/Sentry';
import ResultsContainer from './containers/ResultsContainer';
import FormContainer from './containers/FormContainer';

initSentry();

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

const paragraphTitle: HTMLElement | null = document.querySelector('.component--news-archive .component__title');

if (paragraphTitle) {
  paragraphTitle.textContent = drupalSettings?.helfi_news_archive?.title ?? Drupal.t('News archive', {}, { context: 'News archive fallback title' });
}

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
