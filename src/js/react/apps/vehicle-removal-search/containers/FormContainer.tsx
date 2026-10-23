import { Button } from 'hds-react';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import type React from 'react';
import { type EventHandler, useCallback } from 'react';
import { PostalCodeFilter } from '../components/PostalCodeFilter';
import { StreetFilter } from '../components/StreetFilter';
import { postalCodesAtom, streetsAtom, submittedStateAtom } from '../store';
import SelectionsContainer from './SelectionsContainer';

const FormContainer = () => {
  const getStreetsValue = useAtomCallback(useCallback((get) => get(streetsAtom), []));
  const getPostalCodesValue = useAtomCallback(useCallback((get) => get(postalCodesAtom), []));
  const updateSubmittedState = useSetAtom(submittedStateAtom);

  const handleSubmit: EventHandler<React.SyntheticEvent<HTMLFormElement>> = (event) => {
    event.preventDefault();
    updateSubmittedState({ streets: getStreetsValue(), postalCodes: getPostalCodesValue(), page: 1 });
  };

  return (
    <form className='hdbt-search--react__form-container vehicle-removal-search-form' onSubmit={handleSubmit}>
      <StreetFilter />
      <PostalCodeFilter />
      <Button className='hdbt-search--react__submit-button' type='submit'>
        {Drupal.t('Search', {}, { context: 'React search: submit button label' })}
      </Button>
      <SelectionsContainer />
    </form>
  );
};

export default FormContainer;
