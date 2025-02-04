import { Select, SelectData, useSelectStorage } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import type OptionType from '../types/OptionType';

import { locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import { ServiceMapPlace } from '@/types/ServiceMap';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import ServiceMap from '@/react/common/enum/ServiceMap';
import { getNameTranslation } from '@/react/common/helpers/ServiceMap';

function LocationFilter() {
  const setLocationFilter = useSetAtom(locationSelectionAtom);
  const [locationSelectOpen, setLocationSelectOpen] = useState(false);
  const updateParams = useSetAtom(updateParamsAtom);

  const getLocations = async (
    searchTerm: string,
    selectedOptions: OptionType[],
    data: SelectData,
  ) => {
    const url = new URL(ServiceMap.PLACES_URL);
    const locationParams = new URLSearchParams({
      has_upcoming_events: 'true',
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

  const onChange = (value: OptionType[], clickedOption: OptionType) => {
    setLocationFilter(value.map((location: any) => ({
      value: location.value,
      label: location.label
    })));
    updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });

    if (clickedOption) {
      setLocationSelectOpen(true);
    }
  };

  const selectVenueLabel: string = Drupal.t('Select a venue', {}, {context: 'Events search'});

  const storage = useSelectStorage({
    id: SearchComponents.LOCATION,
    onBlur: () => setLocationSelectOpen(false),
    onChange,
    open: locationSelectOpen,
    multiSelect: true,
    noTags: true,
    onSearch: (searchTerm: string, selectedOptions: OptionType[], data: SelectData) => getLocations(searchTerm, selectedOptions, data),
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
}

export default LocationFilter;
