import React from 'react';
import ReactDOM from 'react-dom';

import initSentry from '@/react/common/helpers/Sentry';
import FormContainer from './containers/FormContainer';

import { ApplicantInfo } from './steps/ApplicantInfo';
import { type FormConfig } from './types/FormConfig';
import { FormNotFoundError } from './components/FormNotFoundError';
import { ATVData } from './types/ATVData';
import { Preview } from './components/Preview';

initSentry();

const addStaticPages = (config: FormConfig) => {
  return config.concat([
    {
      label: Drupal.t('Confirm, preview, and submit'),
      render: Preview
    },
    {
      label: Drupal.t('Complete'),
      render: ApplicantInfo
    }
  ]);
};

const rootSelector: string = 'grants-react-form';
const rootElement: HTMLElement | null = document.getElementById(rootSelector);
const { application_number: applicationNumber, form } = drupalSettings.grants_react_form;
let formConfig: FormConfig|null = null;
let atvData: ATVData = null;

try {
  formConfig = addStaticPages(require(`./forms/${form}`).Form);
  // @todo hydrate from ATV data if available
  atvData = null;
}
catch (e) {
  console.error(e);
}

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      {!formConfig
        ? <FormNotFoundError />
        : <FormContainer
            {...{
              applicationNumber,
              atvData,
              form,
              formConfig
            }}
          />
      }
    </React.StrictMode>,
    rootElement
  );
}
