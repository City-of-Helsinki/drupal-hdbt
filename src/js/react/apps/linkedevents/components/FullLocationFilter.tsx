import { Select, SelectData, useSelectStorage } from 'hds-react';
import {  useAtom, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { memo, useCallback, useEffect, useState } from 'react';
import type OptionType from '../types/OptionType';

import { locationSelectionAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import { ServiceMapPlace } from '@/types/ServiceMap';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import { getNameTranslation } from '@/react/common/helpers/ServiceMap';
import LinkedEvents from '@/react/common/enum/LinkedEvents';

const FullLocationFilter = memo(() => {
  const [locationSelection, setLocationFilter] = useAtom(locationSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);
  const [locationSelectOpen, setLocationSelectOpen] = useState(false);

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

  const onChange = (value: OptionType[], clickedOption?: OptionType) => {
    setLocationFilter(value);
    if (clickedOption) setLocationSelectOpen(true);
    updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });
  };

  const selectVenueLabel: string = Drupal.t('Select a venue', {}, {context: 'Events search'});


  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.LOCATION}
        multiSelect
        noTags
        onChange={onChange}
        onBlur={() => setLocationSelectOpen(false)}
        open={locationSelectOpen}
        onSearch={getLocations}
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
      />
    </div>
  );
});

export default FullLocationFilter;
