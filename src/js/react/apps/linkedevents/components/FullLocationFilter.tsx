import { Select, SelectData, useSelectStorage } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useEffect, useRef, useState } from 'react';
import type OptionType from '../types/OptionType';

import { locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import { ServiceMapPlace } from '@/types/ServiceMap';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import { getNameTranslation } from '@/react/common/helpers/ServiceMap';
import LinkedEvents from '@/react/common/enum/LinkedEvents';

const FullLocationFilter = memo(() => {
  const [updateKey, setUpdateKey] = useState<string>('0');
  const setLocationFilter = useSetAtom(locationSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const getLocations = async (
    searchTerm: string,
    selectedOptions: OptionType[],
    data: SelectData,
  ) => {
    const url = new URL(LinkedEvents.PLACES_URL);
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

  const onChange = (value: OptionType[], clickedOption: OptionType, data: SelectData) => {
    setLocationFilter(value.map((location: any) => ({
      value: location.value,
      label: location.label
    })));
    updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });
  };

  const selectVenueLabel: string = Drupal.t('Select a venue', {}, {context: 'Events search'});

  const storage = useSelectStorage({
    id: SearchComponents.LOCATION,
    multiSelect: true,
    noTags: true,
    onChange,
    onSearch: getLocations,
    updateKey,
  });

  const incrementUpdateKey = () => {
    setUpdateKey((Number(updateKey) + 1).toString());
  };

  useEffect(() => {
    window.addEventListener('eventsearch-clear', incrementUpdateKey);

    return () => window.removeEventListener('eventsearch-clear', incrementUpdateKey);
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
});

export default FullLocationFilter;
