import { useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { streetsAtom } from '../store';
import { type Option, type SearchFunction, Select, useSelectStorage } from 'hds-react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';
import { Events } from '../enum/Event';

/**
 * Query suggestions from service map API.
 */
const useServiceMapSuggestions = (currentLanguage: string) => {
  // Languages supported by the service map API.
  const supportedLanguages = ['fi', 'sv'];

  currentLanguage = supportedLanguages.includes(currentLanguage) ? currentLanguage : 'fi';

  return useCallback<SearchFunction>(
    async (searchTerm, _selectedOptions, _data) => {
      const query = new URLSearchParams({
        input: searchTerm,
        municipality: 'Helsinki',
        page_size: 50,
      });

      const response = await fetch(`https://api.hel.fi/servicemap/v2/street/?${query}`, {
        method: 'GET',
      });

      const json = await response.json();

      return {
        options:
          json.results?.map((result) => ({
            value: result.name[currentLanguage],
            label: result.name[currentLanguage],
          })) ?? [],
      };
    },
    [currentLanguage],
  );
};

export const StreetFilter = () => {
  const setStreets = useSetAtom(streetsAtom);
  const getStreetsValue = useAtomCallback(useCallback((get) => get(streetsAtom), []));
  const onSearch = useServiceMapSuggestions(drupalSettings.path.currentLanguage);

  const onChange = (selectedOptions: Array<Required<Option>>) => {
    setStreets(selectedOptions);
    selectStorage.updateAllOptions((option, _group, _groupindex) => ({
      ...option,
      selected: selectedOptions.some((selection) => selection.value === option.value),
    }));
  };

  const selectStorage = useSelectStorage({
    disabled: false,
    id: 'streets',
    invalid: false,
    multiSelect: true,
    noTags: true,
    onChange,
    onSearch,
    open: false,
    options: getStreetsValue()?.map((dm) => ({ ...dm, selected: true })) ?? [],
    clearable: true,
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(selectStorage);
  };

  const updateSelections = () => {
    updateSelectionsInStorage(selectStorage, getStreetsValue());
  };

  useEffect(() => {
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);

    return () => {
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);
    };
  });

  return (
    <Select
      className='hdbt-search__dropdown'
      texts={{
        label: Drupal.t('Street name', {}, { context: 'Vehicle removal search' }),
        placeholder: Drupal.t('All', {}, { context: 'Vehicle removal search' }),
        searchLabel: Drupal.t('Write a street name', {}, { context: 'Vehicle removal search' }),
        searchPlaceholder: Drupal.t('For example, Kotikatu 1', {}, { context: 'Vehicle removal search' }),
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': 'foobar' },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': 'barfoo' },
          { context: 'React search clear selection label' },
        ),
      }}
      theme={defaultMultiSelectTheme}
      {...selectStorage.getProps()}
    />
  );
};
