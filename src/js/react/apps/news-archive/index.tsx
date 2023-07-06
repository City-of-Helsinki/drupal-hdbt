import React from 'react';
import ReactDOM from 'react-dom';
import ResultsContainer from './containers/ResultsContainer';

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <ResultsContainer />
    </React.StrictMode>,
    rootElement
  );
}
