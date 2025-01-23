import { Select } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import type OptionType from '../types/OptionType';

import { locationAtom, locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';

function LocationFilter() {
  const locationOptions = useAtomValue(locationAtom);
  const [locationSelection, setLocationFilter] = useAtom(locationSelectionAtom);
  const [locationSelectOpen, setLocationSelectOpen] = useState(false);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (selectedOptions: OptionType[], clickedOption?: OptionType) => {
    setLocationFilter(selectedOptions);
    if (clickedOption) setLocationSelectOpen(true);
    updateParams({ [ApiKeys.LOCATION]: selectedOptions.map((location: any) => location.value).join(',') });
  };

  const selectVenueLabel: string = Drupal.t('Select a venue', {}, {context: 'Events search'});

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.LOCATION}
        multiSelect
        noTags
        onBlur={() => setLocationSelectOpen(false)}
        onChange={onChange}
        open={locationSelectOpen}
        options={locationOptions}
        texts={{
          clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': selectVenueLabel}, { context: 'React search clear selection label' }),
          clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': selectVenueLabel}, { context: 'React search clear selection label' }),
          label: selectVenueLabel,
          placeholder: Drupal.t('All', {}, { context: 'React search: all available options' }),
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
