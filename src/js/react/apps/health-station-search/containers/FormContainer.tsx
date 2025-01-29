import { Button, Checkbox, TextInput } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';

import { paramsAtom, stagedParamsAtom } from '../store';
import SearchParams from '../types/SearchParams';

type SubmitFormType = HTMLFormElement & {
  address: HTMLInputElement;
};

const ProximityFormContainer = ({ initialParams }: { initialParams?: SearchParams|null }) => {
  const stagedParams = useAtomValue(stagedParamsAtom);
  const setParams = useSetAtom(paramsAtom);
  const setStagedParams = useSetAtom(stagedParamsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { address, sv_only } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (address.value && address.value.length) {
      params.address = address.value;
    };

    params.sv_only = sv_only.checked;

    setParams(params);
  };

  return (
    <form className='hdbt-search--react__form-container' role='search' onSubmit={onSubmit}>
      <TextInput
        className='hdbt-search__filter hdbt-search--react__text-field'
        helperText={Drupal.t('Enter the street name and house number', {}, { context: 'React search: street input helper'})}
        placeholder={Drupal.t('For example, Kotikatu 1', {}, { context: 'React search: street input helper placeholder'})}
        id='address'
        label={Drupal.t('Home address', {}, { context: 'React search: home address'})}
        type='search'
        defaultValue={initialParams?.address || ''}
      />
      <div className='react-search__checkbox-filter-container'>
        <fieldset className='hdbt-search--react__fieldset'>
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.sv_only || false}
            id='sv_only'
            name='sv_only'
            value='sv_only'
            onClick={() => setStagedParams({...stagedParams, sv_only: !stagedParams?.sv_only})}
            label={Drupal.t('Show the nearest service location where service is available in Swedish.', {}, { context: 'React search: checkbox label swedish'})}
          />
        </fieldset>
      </div>
      <Button className='hdbt-search--react__submit-button' type='submit'>{Drupal.t('Search', {}, { context: 'React search: submit button label'})}</Button>
    </form>
  );
};

export default ProximityFormContainer;
