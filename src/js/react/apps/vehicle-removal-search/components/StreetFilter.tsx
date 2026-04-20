import { useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { streetsAtom } from '../store';
import { type Option, type SearchFunction, Select, useSelectStorage } from 'hds-react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';
import { Events } from '../enum/Event';

/**
 * Query street name suggestions from Elasticsearch.
 */
const useStreetSuggestions = (currentLanguage: string) => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;
  const supportedLanguages = ['fi', 'sv', 'en'];
  const lang = supportedLanguages.includes(currentLanguage) ? currentLanguage : 'fi';

  return useCallback<SearchFunction>(
    async (searchTerm, _selectedOptions, _data) => {
      const query = {
        size: 50,
        query: {
          bool: {
            must: [
              { match_phrase_prefix: { street_name: { query: searchTerm } } },
              { term: { search_api_language: lang } },
            ],
          },
        },
        _source: ['street_name'],
      };

      const response = await fetch(`${url}/paikkatieto_street_names/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });

      const data = await response.json();
      const hits = data?.hits?.hits ?? [];

      const seen = new Set<string>();
      const options: Array<{ value: string; label: string }> = [];

      for (const hit of hits) {
        const raw = hit._source?.street_name;
        const name = Array.isArray(raw) ? raw[0] : raw;
        if (name && !seen.has(name)) {
          seen.add(name);
          options.push({ value: name, label: name });
        }
      }

      return { options };
    },
    [url, lang],
  );
};

export const StreetFilter = () => {
  const setStreets = useSetAtom(streetsAtom);
  const getStreetsValue = useAtomCallback(useCallback((get) => get(streetsAtom), []));
  const onSearch = useStreetSuggestions(drupalSettings.path.currentLanguage);

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
        searchPlaceholder: Drupal.t('For example, Kotikatu', {}, { context: 'Vehicle removal search' }),
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
