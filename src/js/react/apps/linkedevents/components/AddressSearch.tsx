import { TextInput } from 'hds-react';
import { useSetAtom } from 'jotai';
import { SyntheticEvent } from 'react';
import { addressAtom } from '../store';

const AddressSearch = () => {
  const updateAddress = useSetAtom(addressAtom);

  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    updateAddress(target.value);
  };

  return (
    <div className='hdbt-search__filter'>
      <TextInput
        className='hdbt-search__input'
        helperText={Drupal.t('placeholder', {}, {context: 'placeholder'})}
        id='location'
        label={Drupal.t('placeholder')}
        type='search'
        onChange={onChange}
      />
    </div>
  );
};

export default AddressSearch;
