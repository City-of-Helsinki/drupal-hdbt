import Form from '@rjsf/core';
import { RJSFSchema, RegistryFieldsType, RegistryWidgetsType, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { TextArea, TextInput, SubmitButton } from '../components/Input';
import { FieldsetWidget, ObjectFieldTemplate } from '../components/Templates';
import { map } from 'zod';

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
          required: ['mapName', 'size', 'voluntaryHours'],
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

const RJSFFormContainer = () => {
  return (
    <div className='form-wrapper'>
      <Form
        className='grants-react-form'
        noHtml5Validate
        onSubmit={(data, event) => console.log(data, event)}
        schema={schema}
        templates={{ObjectFieldTemplate, ButtonTemplates: { SubmitButton }}}
        uiSchema={uiSchema}
        validator={validator}
        widgets={widgets}
      />
    </div>
  )
}

export default RJSFFormContainer;
