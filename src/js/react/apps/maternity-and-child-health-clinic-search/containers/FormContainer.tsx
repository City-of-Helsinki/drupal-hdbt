import { Button, Checkbox } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AddressSearch } from '@/react/common/AddressSearch';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import { keywordAtom, paramsAtom, stagedParamsAtom } from '../store';
import type SearchParams from '../types/SearchParams';

type SubmitFormType = HTMLFormElement & {
  sv_only: HTMLInputElement;
};

const ProximityFormContainer = ({
  initialParams,
}: {
  initialParams: SearchParams | null;
}) => {
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const stagedParams = useAtomValue(stagedParamsAtom);
  const setParams = useSetAtom(paramsAtom);
  const setStagedParams = useSetAtom(stagedParamsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { sv_only } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword?.length) {
      params.address = keyword;
    }

    params.sv_only = sv_only.checked;

    setParams(params);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: @todo UHF-12501
    <form
      className='hdbt-search--react__form-container'
      role='search'
      onSubmit={onSubmit}
    >
      <AddressSearch
        className='hdbt-search__filter hdbt-search--react__text-field'
        clearButtonAriaLabel={Drupal.t(
          'Clear',
          {},
          { context: 'React search' },
        )}
        defaultValue={initialParams?.address || ''}
        helperText={Drupal.t(
          'Enter the street name and house number',
          {},
          { context: 'React search: street input helper' },
        )}
        id='address'
        label={Drupal.t(
          'Home address',
          {},
          { context: 'React search: home address' },
        )}
        onChange={(address: string) => setKeyword(address)}
        onSubmit={(address: string) => setKeyword(address)}
        placeholder={Drupal.t(
          'For example, Kotikatu 1',
          {},
          { context: 'React search: street input helper placeholder' },
        )}
      />
      <div className='react-search__checkbox-filter-container'>
        <fieldset className='hdbt-search--react__fieldset'>
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.sv_only || false}
            id='sv_only'
            name='sv_only'
            value='sv_only'
            onClick={() =>
              setStagedParams({
                ...stagedParams,
                sv_only: !stagedParams?.sv_only,
              })
            }
            label={Drupal.t(
              'Show the nearest service location where service is available in Swedish.',
              {},
              { context: 'React search: checkbox label swedish' },
            )}
            style={defaultCheckboxStyle}
          />
        </fieldset>
      </div>
      <Button className='hdbt-search--react__submit-button' type='submit'>
        {Drupal.t(
          'Search',
          {},
          { context: 'React search: submit button label' },
        )}
      </Button>
    </form>
  );
};

export default ProximityFormContainer;
