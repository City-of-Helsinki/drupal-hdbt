import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import SearchContainer from './containers/SearchContainer';
import ROOT_ID from './enum/RootId';
import { GhostList } from '@/react/common/GhostList';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for Events filter', { ROOT_ID });
    return;
  }

  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={
        <GhostList count={30} />
      }>
        <SearchContainer />
      </Suspense>
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);
