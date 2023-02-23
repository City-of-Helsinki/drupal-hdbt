import { useSetAtom } from 'jotai';
import { Button, TextInput } from 'hds-react';
import { paramsAtom } from '../store';
import type SearchParams from '../types/SearchParams';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
};

const FeatureFormContainer = () => {
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
        {Drupal.t('Search by school features')}
      </h3>
      <p className='react-search__form-description'>
        {Drupal.t(
          'You can search schools by name, language, level, or postal code. Students may be accepted into schools outside of their own district if there\'s room. Note that some schools require passing an exam.',
          {},
          {context: 'Feature search description'}
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        id='keyword'
        label={Drupal.t('School name or postal code')}
        type='search'
      />
      <Button className='hdbt-search__submit-button' type='submit'>{Drupal.t('Submit')}</Button>
    </form>
  );
};

export default FeatureFormContainer;
