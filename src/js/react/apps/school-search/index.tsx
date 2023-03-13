import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { LoadingSpinner } from 'hds-react';
import SearchContainer from './containers/SearchContainer';

const ROOT_ID = 'helfi-school-search';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for School search app', { ROOT_ID });
    return;
  }

  ReactDOM.render(
    <React.StrictMode>
      <div className='component--react-search component--react-search--schools'>
        <SearchContainer />
      </div>
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);
