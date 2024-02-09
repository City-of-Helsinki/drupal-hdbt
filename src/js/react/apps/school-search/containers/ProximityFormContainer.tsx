import { Button, TextInput } from 'hds-react';
import { useSetAtom } from 'jotai';

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
      params.keyword = keyword.value;
    };

    setParams(params);
  };

  return (
    <form className='hdbt-search--react__form-container' role='search' onSubmit={onSubmit}>
      <h3>
        {Drupal.t('Search for your local school', {}, {context: 'School search: local search title'})}
      </h3>
      <p className='hdbt-search--react__form-description'>
        {Drupal.t(
          'Your child\'s primary comprehensive school, i.e., the local school, is assigned based on the child\'s home address. You can search for Finnish- and Swedish-language comprehensive schools.',
          {},
          {context: 'School search: local search description'}
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        helperText={Drupal.t('Enter the street name and house number', {}, { context: 'React search: street input helper'})}
        id='keyword'
        label={Drupal.t('The child\'s home address', {}, { context: 'School search: input label'})}
        type='search'
      />
      <Button className='hdbt-search__submit-button' type='submit'>{Drupal.t('Search')}</Button>
    </form>
  );
};

export default ProximityFormContainer;
