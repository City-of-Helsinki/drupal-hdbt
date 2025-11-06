import { Select, type SelectData } from 'hds-react';
import { useSelectStorage } from 'hds-react/components/select';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { memo, useCallback, useEffect } from 'react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import LinkedEvents from '@/react/common/enum/LinkedEvents';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';
import { getNameTranslation } from '@/react/common/helpers/ServiceMap';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import type { ServiceMapPlace } from '@/types/ServiceMap';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import { locationSelectionAtom, updateParamsAtom } from '../store';
import type OptionType from '../types/OptionType';

const FullLocationFilter = memo(() => {
  const setLocationFilter = useSetAtom(locationSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const getLocationParamValue = useAtomCallback(useCallback((get) => get(locationSelectionAtom), []));

  const getLocations = async (searchTerm: string, _selectedOptions: OptionType[], _data: SelectData) => {
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

    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12066
    const response = await useTimeoutFetch(url.toString());

    if (response.status !== 200) {
      return result;
    }

    const body = await response.json();

    if (body.data?.length) {
      result.options = body.data.map((place: ServiceMapPlace) => ({
        value: place.id,
        label: getNameTranslation(place.name, drupalSettings.path.currentLanguage),
      }));
      return result;
    }

    return result;
  };

  const onChange = (value: OptionType[], clickedOption: OptionType, _data: SelectData) => {
    setLocationFilter(
      value.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    );
    // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
    updateParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });

    storage.updateAllOptions((option, _group, _groupindex) => ({
      ...option,
      selected: value.some((selection) => selection.value === option.value),
    }));

    if (clickedOption) {
      storage.setOpen(true);
    }
  };

  const selectVenueLabel: string = Drupal.t('Venue', {}, { context: 'Events search' });

  const storage = useSelectStorage({
    id: SearchComponents.LOCATION,
    multiSelect: true,
    noTags: true,
    onChange,
    open: false,
    onSearch: getLocations,
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
          label: selectVenueLabel,
          language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
          placeholder: Drupal.t('All venues', {}, { context: 'React search: all available options' }),
          searchLabel: Drupal.t('Search term', {}, { context: 'React search: all available options' }),
          searchPlaceholder: Drupal.t('For example, Oodi', {}, { context: 'React search: all available options' }),
          assistive: Drupal.t(
            'Events are shown only from venues less than two kilometres from the address',
            {},
            { context: 'React search: all available options' },
          ),
        }}
        theme={defaultMultiSelectTheme}
        {...storage.getProps()}
      />
    </div>
  );
});

export default FullLocationFilter;
