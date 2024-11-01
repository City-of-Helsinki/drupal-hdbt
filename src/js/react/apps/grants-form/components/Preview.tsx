import { useAtomValue, useSetAtom } from 'jotai';
import { getItemsAtom, modifyFormStateAtom } from '../store';
import { FormEvent } from 'react';
import { Button } from 'hds-react';
import { z } from 'zod';

export const Preview = () => {
  const items = useAtomValue(getItemsAtom);
  const modifyFormState = useSetAtom(modifyFormStateAtom);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    let errors = false;
    items.forEach((item, step) => {
      const { schema, data } = item;
      const result  = schema ?
        schema.safeParse(Object.fromEntries(data)) :
        {success: true};

      if (!result.success) {
        errors = true;
      }

      modifyFormState(data, result, step);
    });

    if (errors) {
      console.warn(errors);
      return;
    }
  };

  return (
    <form
      method='post'
      className='webform-submission-form'
      onSubmit={handleSubmit}
    >
      <pre>{JSON.stringify(items, null, 2)}</pre>
      <Button
        type='submit'
        variant='primary'
      >
        {Drupal.t('Submit')}
      </Button>

    </form>
  )
};
