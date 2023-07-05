import React from 'react';
import ReactDOM from 'react-dom';

const rootSelector: string = 'helfi-etusivu-news-search';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
    </React.StrictMode>,
    rootElement
  );
}
