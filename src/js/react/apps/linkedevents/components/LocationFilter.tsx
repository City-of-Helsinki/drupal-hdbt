import { Select, useSelectStorage } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import type OptionType from '../types/OptionType';

import { locationAtom, locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import useSelectedOptions from '@/react/common/hooks/useSelectedOptions';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';

const LocationFilter = () => {
  const locationOptions = useAtomValue(locationAtom);
  const [locationSelection, setLocationFilter] = useAtom(locationSelectionAtom);
  const selectedOptions = useSelectedOptions(locationOptions, locationSelection);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (value: OptionType[], clickedOption?: OptionType) => {
    setLocationFilter(value);
    updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });
  };

  const selectVenueLabel: string = Drupal.t('Select a venue', {}, {context: 'Events search'});

  const storage = useSelectStorage({
    id: SearchComponents.LOCATION,
    multiSelect: true,
    noTags: true,
    onChange,
    options: selectedOptions,
    texts: {
      clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': selectVenueLabel}, { context: 'React search clear selection label' }),
      clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': selectVenueLabel}, { context: 'React search clear selection label' }),
      label: selectVenueLabel,
      placeholder: Drupal.t('All', {}, { context: 'React search: all available options' }),
    },
    theme: {
      '--checkbox-background-selected': 'var(--hdbt-color-black)',
      '--focus-outline-color': 'var(--hdbt-color-black)',
      '--placeholder-color': 'var(--hdbt-color-black)',
    }
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(storage);
  };

  const updateSelections = () => {
    updateSelectionsInStorage(storage, locationSelection);
  };

  useEffect(() => {
    window.addEventListener('eventsearch-clear', updateSelections);
    window.addEventListener(`eventsearch-clear-${SearchComponents.LOCATION}`, updateSelections);

    return () => {
      window.addEventListener('eventsearch-clear', clearAllSelections);
      window.removeEventListener(`eventsearch-clear-${SearchComponents.LOCATION}`, updateSelections);
    };
  });

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
};

export default LocationFilter;
