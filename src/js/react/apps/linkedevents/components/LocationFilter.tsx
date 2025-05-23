import { Select } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import type OptionType from '../types/OptionType';

import { locationAtom, locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';

function LocationFilter() {
  const locationOptions = useAtomValue(locationAtom);
  const [locationSelection, setLocationFilter] = useAtom(locationSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (selectedOptions: OptionType[]) => {
    setLocationFilter(selectedOptions);
    updateParams({ [ApiKeys.LOCATION]: selectedOptions.map((location: any) => location.value).join(',') });
  };

  const selectVenueLabel: string = Drupal.t('Venue', {}, {context: 'Events search'});

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.LOCATION}
        multiSelect
        noTags
        onChange={onChange}
        options={locationOptions}
        texts={{
          label: selectVenueLabel,
          placeholder: Drupal.t('All venues', {}, { context: 'React search: all available options' }),
        }}
        theme={{
          '--checkbox-background-selected': 'var(--hdbt-color-black)',
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--placeholder-color': 'var(--hdbt-color-black)',
        }}
        value={locationSelection}
      />
    </div>
  );
}

export default LocationFilter;
