import React from 'react';
import ReactDOM from 'react-dom';

import initSentry from '@/react/common/helpers/Sentry';
import FormContainer from '../district-and-project-search/containers/FormContainer';

initSentry();

const rootSelector: string = 'grants-form-app';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <FormContainer />
    </React.StrictMode>,
    rootElement
  );
}
