import React from 'react';
import ReactDOM from 'react-dom';
import type FilterSettings from '@/types/FilterSettings';
import SearchContainer from './containers/SearchContainer';
import QueryBuilder from './utils/QueryBuilder';
import ROOT_ID from './enum/RootId';

const start = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const eventsApiUrl = rootElement?.dataset?.eventsApiUrl;

  if (!rootElement) {
    console.warn('Root id missing for Events filter', { ROOT_ID });
    return;
  }

  if (!eventsApiUrl) {
    console.warn('Events API url missing for Events filter.');
    return;
  }

  const queryBuilder = QueryBuilder(eventsApiUrl);
  const filterSettings: FilterSettings = {
    showLocation: rootElement?.dataset?.showLocationFilter === '1',
    showTimeFilter: rootElement?.dataset?.showTimeFilter === '1',
    showFreeFilter: rootElement?.dataset?.showFreeEventsFilter === '1',
    showRemoteFilter: rootElement?.dataset?.showRemoteEventsFilter === '1',
  };

  ReactDOM.render(
    <React.StrictMode>
      <SearchContainer queryBuilder={queryBuilder} filterSettings={filterSettings} />
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);
