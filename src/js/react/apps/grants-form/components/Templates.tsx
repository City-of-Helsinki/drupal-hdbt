import { ObjectFieldTemplateProps } from '@rjsf/utils'
import { Fieldset } from 'hds-react';

export const FieldsetWidget = () => {
  return (
    <Fieldset
      border
      heading={''}
    >

    </Fieldset>
  )
};

export const ObjectFieldTemplate = ({
  schema,
  properties,
  idSchema,
  uiSchema,
}: ObjectFieldTemplateProps) => {
  const { title, description } = schema;

  if (idSchema.$id === 'root') {
    return (
      <div className='form-wrapper'>
        <h2 className="grants__page-header">
          {title}
        </h2>
        {properties.map((field) => field.content)}
      </div>
    )
  }

  if (uiSchema && uiSchema['ui:widget'] === 'FieldsetWidget') {
    return (
      <Fieldset
        border={properties.length > 1}
        heading={description || ''}
      >
        {properties.map((field) => field.content)}
      </Fieldset>
    );
  }

  return (
    <section className='form-item webform-section'>
      <div className='webform-section-flex-wrapper'>
        <h3 className='webform-section-title'>
          {title}
        </h3>
        <div className='webform-section-wrapper'>
          {properties.map((field) => field.content)}
        </div>
      </div>
    </section>
  );
};
