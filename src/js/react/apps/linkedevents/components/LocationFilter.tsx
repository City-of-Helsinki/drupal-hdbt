import { Select, useSelectStorage } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import type OptionType from '../types/OptionType';

import { locationAtom, locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';

function LocationFilter() {
  const locationOptions = useAtomValue(locationAtom);
  const setLocationFilter = useSetAtom(locationSelectionAtom);
  const [locationSelectOpen, setLocationSelectOpen] = useState(false);
  const updateParams = useSetAtom(updateParamsAtom);

  const storage = useSelectStorage({
    id: SearchComponents.LOCATION,
    onBlur: () => setLocationSelectOpen(false),
    onChange: (value: OptionType[], clickedOption: OptionType) => {
      setLocationFilter(value);
      updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });

      if (clickedOption) {
        setLocationSelectOpen(true);
      }
    },
    open: locationSelectOpen,
    options: locationOptions?.map((option) => ({...option})) || [],
    multiSelect: true,
    noTags: true,
  });

  const selectVenueLabel: string = Drupal.t('Select a venue', {}, {context: 'Events search'});

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
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
        {...storage.getProps()}
      />
    </div>
  );
}

export default LocationFilter;
