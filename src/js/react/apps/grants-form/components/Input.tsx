import { SubmitButtonProps, WidgetProps } from '@rjsf/utils';
import { Button, TextArea as HDSTextArea, TextInput as HDSTextInput, IconDownloadCloud, IconTrash  } from 'hds-react';
import React from 'react';

export const TextInput = ({
  defaultValue,
  id,
  label,
  name,
  onChange,
  readonly,
}: WidgetProps) => {
  const compatibleDefault = typeof defaultValue === 'string' ? defaultValue : undefined;

  return (
    <HDSTextInput
      defaultValue={compatibleDefault}
      hideLabel={false}
      id={id}
      label={label}
      name={name}
      onBlur={() => null}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      onFocus={() => null}
      readOnly={readonly}
    />
  );
};

export const TextArea = ({
  defaultValue,
  id,
  label,
  name,
  onChange,
  readonly,
}: WidgetProps) => {
  return (
    <HDSTextArea
      hideLabel={false}
      id={id}
      label={label}
      name={name}
      onBlur={() => null}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
      onFocus={() => null}
    />
  );
};

export const SubmitButton = (props: SubmitButtonProps) => {
  return (
    <div className='form-actions form-wrapper'>
      <div className='actions'>
        <Button
          iconLeft={<IconTrash />}
          theme='black'
          type='button'
          variant='supplementary'
        >
          {Drupal.t('Delete draft')}
        </Button>
        <Button
          iconLeft={<IconDownloadCloud />}
          theme='black'
          type='button'
          variant='supplementary'
        >
          {Drupal.t('Save as draft')}
        </Button>
        <Button
          theme='black'
          type='submit'
          variant='primary'
        >
          {Drupal.t('Next')}
        </Button>
      </div>
    </div>
  );
};
