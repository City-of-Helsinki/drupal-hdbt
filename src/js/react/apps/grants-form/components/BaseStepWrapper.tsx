import { Button, IconDownloadCloud, IconTrash } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { type FormEvent, type ReactNode } from 'react';
import { getCurrentStepAtom, getItemsAtom, modifyFormStateAtom } from '../store';
import { z } from 'zod';

type BaseStepWrapperProps = {
  children: ReactNode;
}

export const BaseStepWrapper = ({ children }: BaseStepWrapperProps) => {
  const step = useAtomValue(getCurrentStepAtom);
  const items = useAtomValue(getItemsAtom);
  const modifyFormState = useSetAtom(modifyFormStateAtom);

  const validateData = (formData: FormData) => {
    const schema = items[step]?.schema;
    if (!schema) {
      return {
        success: true
      };
    }
    const data = Object.fromEntries(formData);
    return schema.safeParse(data);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const result = validateData(formData);

    console.log(formData, result);

    modifyFormState(formData, result, step);
  };

  return (
    <form
      className='webform-submission-form'
      onSubmit={onSubmit}
    >
      {children}
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
    </form>
  );
}
