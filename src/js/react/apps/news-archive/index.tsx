import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import initSentry from '@/react/common/helpers/Sentry';
import ResultsContainer from './containers/ResultsContainer';
import FormContainer from './containers/FormContainer';
import { GhostList } from '@/react/common/GhostList';
import GlobalSettings from './enum/Global';

initSentry();

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  const hideForm = drupalSettings?.helfi_news_archive?.hide_form ?? false;
  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={
        <GhostList count={GlobalSettings.SIZE} />
      }>
        {hideForm || <FormContainer />}
        <ResultsContainer />
      </Suspense>
    </React.StrictMode>,
    rootElement
  );
}
