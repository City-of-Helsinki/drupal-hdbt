import { Button, Checkbox, TextInput } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';

import { paramsAtom, stagedParamsAtom } from '../store';
import SearchParams from '../types/SearchParams';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
};

const ProximityFormContainer = () => {
  const stagedParams = useAtomValue(stagedParamsAtom);
  const setParams = useSetAtom(paramsAtom);
  const setStagedParams = useSetAtom(stagedParamsAtom);  

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { keyword, sv_only } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.keyword = keyword.value;      
    };

    params.sv_only = sv_only.checked;

    setParams(params);
  };

  const onChange = (event: React.FormEvent<HTMLFormElement>) => {
    const { sv_only } = event.target as SubmitFormType;
    const params: SearchParams = {};
    console.log(params);
    params.sv_only = sv_only.value;

    setParams(params);
  };

  return (
    <form className='react-search__form-container' onSubmit={onSubmit}>
      <h3>
        {Drupal.t('Find your health station', {}, {context: 'Health station search: local search title'})}
      </h3>
      <p className='react-search__form-description'>
        {Drupal.t(
          'Your primary health station is the health station in your area of residence. You can find your health station by entering your home address in the search box.',
          {},
          {context: 'Health station search: local search description'}
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        helperText={Drupal.t('Enter the street name and house number', {}, {context: 'Health station search: input helper'})}
        placeholder={Drupal.t('For example, Kotikatu 1', {}, {context: 'Health station search: input placeholder'})}
        id='keyword'
        label={Drupal.t('Home address', {}, {context: 'Health station search: input label'})}
        type='search'
      />
      <div className='react-search__checkbox-filter-container'>
        <fieldset className='react-search__fieldset'>
          <Checkbox 
            className='react-search__checkbox'
            checked={stagedParams?.sv_only || false}
            id="sv_only"
            name="sv_only"
            onClick={() => setStagedParams({...stagedParams, sv_only: !stagedParams?.sv_only})}
            label={Drupal.t('Show the nearest service location where service is available in Swedish.', {}, {context: 'Health station search: checkbox label'})} 
          />
        </fieldset>
      </div>
      <Button className='hdbt-search__submit-button' type='submit'>{Drupal.t('Search')}</Button>
    </form>
  );
};

export default ProximityFormContainer;
