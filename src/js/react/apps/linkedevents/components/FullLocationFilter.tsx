import { Select, SelectData, useSelectStorage } from 'hds-react';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { memo, useCallback, useEffect } from 'react';
import type OptionType from '../types/OptionType';

import { locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import { ServiceMapPlace } from '@/types/ServiceMap';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import { getNameTranslation } from '@/react/common/helpers/ServiceMap';
import LinkedEvents from '@/react/common/enum/LinkedEvents';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';

const FullLocationFilter = memo(() => {
  const setLocationFilter = useSetAtom(locationSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const getLocationParamValue = useAtomCallback(
    useCallback((get) => get(locationSelectionAtom), [])
  );

  const getLocations = async (
    searchTerm: string,
    selectedOptions: OptionType[],
    data: SelectData,
  ) => {
    const url = new URL(LinkedEvents.PLACES_URL);
    const locationParams = new URLSearchParams({
      has_upcoming_events: 'true',
      municipality: 'helsinki',
      text: searchTerm,
    });
    url.search = locationParams.toString();
    const result = {
      options: [],
    };

    const response = await useTimeoutFetch(url.toString());

    if (response.status !== 200) {
      return result;
    }

    const body = await response.json();

    if (body.data && body.data.length) {
      const places = body.data.map((place: ServiceMapPlace) => ({
        value: place.id,
        label: getNameTranslation(place.name, drupalSettings.path.currentLanguage)
      }));

      result.options = places;
      return result;
    }

    return result;
  };

  const onChange = (value: OptionType[], clickedOption: OptionType, data: SelectData) => {
    setLocationFilter(value.map(option => ({
      label: option.label,
      value: option.value,
    })));
    updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });

    storage.updateAllOptions((option, group, groupindex) => ({
        ...option,
        selected: value.some(selection => selection.value === option.value),
      }));

    if (clickedOption) {
      storage.setOpen(true);
    }
  };

  const selectVenueLabel: string = Drupal.t('Venue', {}, {context: 'Events search'});

  const storage = useSelectStorage({
    id: SearchComponents.LOCATION,
    multiSelect: true,
    noTags: true,
    onChange,
    open: false,
    onSearch: getLocations
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(storage);
  };

  const updateSelections = () => {
    updateSelectionsInStorage(storage, getLocationParamValue());
  };

  useEffect(() => {
    window.addEventListener('eventsearch-clear', clearAllSelections);
    window.addEventListener(`eventsearch-clear-${ApiKeys.LOCATION}`, updateSelections);

    return () => {
      window.addEventListener('eventsearch-clear', clearAllSelections);
      window.removeEventListener(`eventsearch-clear-${ApiKeys.LOCATION}`, updateSelections);
    };
  });

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      {/* @ts-ignore */}
      <Select
        className='hdbt-search__dropdown'
        texts={{
          clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': selectVenueLabel}, { context: 'React search clear selection label' }),
          clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': selectVenueLabel}, { context: 'React search clear selection label' }),
          label: selectVenueLabel,
          placeholder: Drupal.t('All venues', {}, { context: 'React search: all available options' }),
          searchLabel: Drupal.t('Search term', {}, { context: 'React search: all available options' }),
          searchPlaceholder: Drupal.t('For example, Oodi', {}, { context: 'React search: all available options' }),
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
});

export default FullLocationFilter;
