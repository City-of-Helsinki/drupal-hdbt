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
        id='location'
        label={Drupal.t('Address', {}, {context: 'Events search'})}
        type='search'
        onChange={onChange}
        required
      />
    </div>
  );
};

export default AddressSearch;
