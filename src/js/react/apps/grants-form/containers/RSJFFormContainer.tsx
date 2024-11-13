import Form from '@rjsf/core';
import { RJSFSchema, RegistryFieldsType, RegistryWidgetsType, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { map } from 'zod';
import React from 'react';
import { TextArea, TextInput, SubmitButton } from '../components/Input';
import { FieldsetWidget, ObjectFieldTemplate } from '../components/Templates';

const schema: RJSFSchema = {
  title: 'Avustustiedot',
  type: 'object',
  properties: {
    info: {
      type: 'object',
      title: 'Avustuksen tiedot',
      description: 'Tällä lomakkeella haetaan avustusta suunnistuskarttan valmistuskustannuksista. Avustusta voidaan myöntää vain Suunnistusliiton karttarekisteriin raportoiduista suunnistus- ja opetuskartoista.',
      properties: {
        orienteering_maps: {
          type: 'object',
          properties: {
            mapName: {
              type: 'string',
              title: 'Kartan nimi, sijainti ja karttatyyppi',
              minLength: 5
            },
            size: {
              type: 'number',
              title: 'Koko km2',
            },
            voluntaryHours: {
              type: 'number',
              title: 'Talkootyö tuntia',
            },
          },
        }
      }
    },
    }
};

const uiSchema: UiSchema = {
  'ui:globalOptions': {
    label: false,
  },
  info: {
    orienteering_maps: {
      'ui:widget': 'FieldsetWidget',
      mapName: {
        'ui:widget': 'textarea'
      }
    }
  }
};

const widgets: RegistryWidgetsType = {
  FieldsetWidget,
  TextareaWidget: TextArea,
  TextWidget: TextInput,
};

const RJSFFormContainer = () => (
    <div className='form-wrapper'>
      <Form
        className='grants-react-form'
        method='POST'
        noHtml5Validate
        onSubmit={async(data, event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          const form = event.target;
          if (form instanceof HTMLFormElement) {
            const formData = new FormData(form);

            const response = await fetch('/react/submit', {
              method: 'POST',
              body: formData,
            });
          }
        }}
        schema={schema}
        templates={{ObjectFieldTemplate, ButtonTemplates: { SubmitButton }}}
        uiSchema={uiSchema}
        validator={validator}
        widgets={widgets}
      />
    </div>
  );

export default RJSFFormContainer;
