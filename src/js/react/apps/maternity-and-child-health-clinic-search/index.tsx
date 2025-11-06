import React from 'react';
import ReactDOM from 'react-dom';

import initSentry from '@/react/common/helpers/Sentry';
import SearchContainer from './containers/SearchContainer';

initSentry();

const ROOT_ID = 'helfi-maternity-and-child-health-clinic-search';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn(
      'Root id missing for Maternity and Child Health Clinic search app',
      { ROOT_ID },
    );
    return;
  }

  ReactDOM.render(
    <React.StrictMode>
      <div className='component--react-search component--react-search--maternity-and-child-health-clinic'>
        <SearchContainer />
      </div>
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);
