import React from 'react';
import ReactDOM from 'react-dom';

import initSentry from '@/react/common/helpers/Sentry';
import SearchContainer from './containers/SearchContainer';

initSentry();

const rootSelector: string = 'helfi-kymp-district-project-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <SearchContainer />
    </React.StrictMode>,
    rootElement,
  );
}
