import { Button } from 'hds-react';
import type React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { StreetFilter } from '../components/StreetFilter';
import { streetsAtom, submittedStateAtom } from '../store';
import SelectionsContainer from './SelectionsContainer';

const FormContainer = () => {
  const streets = useAtomValue(streetsAtom);
  const updateSubmittedState = useSetAtom(submittedStateAtom);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSubmittedState({ streets, page: 1 });
  };

  return (
    <search>
      <form className='vehicle-removal-search-form' onSubmit={handleSubmit}>
        <StreetFilter />
        <Button className='hdbt-search--react__submit-button job-search-form__submit-button' type='submit'>
          {Drupal.t('Search', {}, { context: 'React search: submit button label' })}
        </Button>
        <SelectionsContainer />
      </form>
    </search>
  );
};

export default FormContainer;
