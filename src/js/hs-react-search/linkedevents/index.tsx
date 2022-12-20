import type FilterSettings from './types/FilterSettings';
import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from './containers/SearchContainer';
import QueryBuilder from './utils/QueryBuilder';

const ROOT_ID = 'helfi-events-search';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const eventsUrl = rootElement?.dataset?.eventsUrl;

  if (!rootElement) {
    console.warn('Root id missing for Events filter', { ROOT_ID })
    return
  }

  if (!eventsUrl) {
    console.warn('Events API url missing for Events filter.')
    return
  }

  const queryBuilder = QueryBuilder(eventsUrl);
  const filterSettings: FilterSettings = {
    showLocation: rootElement?.dataset?.showLocationFilter === '1',
    showTimeFilter: rootElement?.dataset?.showTimeFilter === '1',
    showFreeFilter: rootElement?.dataset?.showFreeEventsFilter === '1',
    showRemoteFilter: rootElement?.dataset?.showRemoteEventsFilter === '1'
  };

  ReactDOM.render(
    <React.StrictMode>
      <SearchContainer queryBuilder={queryBuilder} filterSettings={filterSettings} />
    </React.StrictMode>,
    rootElement
  );
}

document.addEventListener('DOMContentLoaded', start);