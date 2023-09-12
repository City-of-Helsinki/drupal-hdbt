import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import SearchContainer from './containers/SearchContainer';
import ROOT_ID from './enum/RootId';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for Events filter', { ROOT_ID });
    return;
  }

  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={
        <div className='hdbt__loading-wrapper'>
          <LoadingOverlay />
        </div>
      }>
        <SearchContainer />
      </Suspense>
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);
