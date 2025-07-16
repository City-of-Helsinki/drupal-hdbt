import { Button, ButtonPresetTheme, ButtonVariant } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';

import { AddressSearch } from '@/react/common/AddressSearch';
import { coordinatesAtom, keywordAtom, updateUrlAtom } from '../store';

export const FormContainer = () => {
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const setCoordinates = useSetAtom(coordinatesAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  return (
    <form
      className='hdbt-search--react__form-container'
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateUrl();
      }}
      role='search'
    >
      <AddressSearch
        clearButtonAriaLabel={Drupal.t('Clear', {}, { context: 'React search'})}
        defaultValue={keyword}
        helperText={Drupal.t('Enter the street name and house number', {}, { context: 'React search: street input helper'})}
        hideSearchButton
        id='address'
        includeCoordinates
        label={Drupal.t('Home address', {}, { context: 'React search: home address'})}
        onChange={(address: string) => {
          setKeyword(address);
          setCoordinates(null);
        }}
        onSubmit={(address: { label: string, value: [number, number, string]}) => {
          setKeyword(address.label);

          if (address.value) {
            setCoordinates(address.value);
          }
        }}
        value={keyword}
      />
      <Button
        className='hdbt-search--react__button'
        theme={ButtonPresetTheme.Black}
        type='submit'
        variant={ButtonVariant.Primary}
      >
        {Drupal.t('Search', {}, { context: 'React search: submit button label'})}
      </Button>
    </form>
  );
};
