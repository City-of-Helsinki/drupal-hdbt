import { Button, TextInput } from 'hds-react';
import { useSetAtom } from 'jotai';
import { SyntheticEvent } from 'react';
import { paramsAtom } from '../store';
import SearchParams from '../types/SearchParams';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
};

const ProximityFormContainer = () => {
  const setParams = useSetAtom(paramsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { keyword } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.address = keyword.value;
    };

    setParams(params);
  };

  return (
    <form className='react-search__form-container' onSubmit={onSubmit}>
      <h3>
        {Drupal.t('Search by home address')}
      </h3>
      <p className='react-search__form-description'>
        {Drupal.t(
          'You may search the primary shool choice for your child by the child\'s home address. Results are yielded from all comprehensive schools with classes 1-9. Private and national schools have their own pages.',
          {},
          {context: 'Proximity search description'}
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        helperText={Drupal.t('Input street address')}
        id='keyword'
        label={Drupal.t('Home address')}
        type='search'
      />
      <Button className='hdbt-search__submit-button' type='submit'>{Drupal.t('Submit')}</Button>
    </form>
  );
};

export default ProximityFormContainer;
