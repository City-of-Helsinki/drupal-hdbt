import React from 'react';
import ReactDOM from 'react-dom';

import SearchContainer from './containers/SearchContainer';

const rootSelector: string = 'helfi-kymp-district-project-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <SearchContainer />
    </React.StrictMode>,
    rootElement
  );
}

