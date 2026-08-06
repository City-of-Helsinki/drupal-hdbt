import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { GhostList } from '@/react/common/GhostList';
import initSentry from '@/react/common/helpers/Sentry';
import FormContainer from './containers/FormContainer';
import ResultsContainer from './containers/ResultsContainer';
import GlobalSettings from './enum/Global';

initSentry();

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  const hideForm = drupalSettings?.helfi_news_archive?.hide_form ?? false;
  createRoot(rootElement).render(
    <React.StrictMode>
      <Suspense fallback={<GhostList count={GlobalSettings.SIZE} />}>
        {hideForm || <FormContainer />}
        <ResultsContainer />
      </Suspense>
    </React.StrictMode>,
  );
}
