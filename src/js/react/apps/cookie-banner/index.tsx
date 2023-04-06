import React from 'react';
import ReactDOM from 'react-dom';
import CookieBanner from './cookieBanner';

const start = () => {
  const ROOT_ID = 'helfi-cookie-banner';
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);

  if (!rootElement) {
    console.warn('Root id missing for Events filter', { ROOT_ID });
    return;
  }

  ReactDOM.render(
    <React.StrictMode>
      <CookieBanner />
    </React.StrictMode>,
    rootElement,
  );
};

document.addEventListener('DOMContentLoaded', start);

