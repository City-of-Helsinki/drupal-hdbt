import { Select } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';

import { locationAtom, locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';


function LocationFilter() {
  const locationOptions = useAtomValue(locationAtom);
  const [locationSelection, setLocationFilter] = useAtom(locationSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (value: any) => {
    setLocationFilter(value);
    updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });
  };

  const selectVenueLabel: string = Drupal.t('Select a venue', {}, {context: 'Events search'});

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        clearButtonAriaLabel={Drupal.t('Clear @label selection', {'@label': selectVenueLabel}, { context: 'React search clear selection label' })}
        helper={locationHelper}
        label={selectVenueLabel}
        multiselect
        // @ts-ignore
        options={locationOptions}
        value={locationSelection}
        id={SearchComponents.LOCATION}
        onChange={onChange}
        placeholder={Drupal.t('All', {}, { context: 'React search: all available options' })}
        selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'React search: remove item aria label' })}
        theme={{
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
          '--placeholder-color': 'var(--hdbt-color-black)',
        }}
      />
    </div>
  );
}

export default LocationFilter;
