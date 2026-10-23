import type { SelectProps } from 'hds-react';
import { type Option, type SearchFunction, Select, useSelectStorage } from 'hds-react';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';
import { Events } from '../enum/Event';
import { postalCodesAtom } from '../store';

/**
 * Query postal code suggestions from the postal codes present in the index.
 */
const usePostalCodeSuggestions = () => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;

  return useCallback<SearchFunction>(
    async (searchTerm, _selectedOptions, _data) => {
      // Postal codes are numeric, strip anything else so the term is safe to use in a regex.
      const term = searchTerm.replace(/\D/g, '');

      if (!term) {
        return { options: [] };
      }

      const query = {
        size: 0,
        query: { prefix: { postal_codes: term } },
        aggs: {
          postal_codes: {
            terms: {
              field: 'postal_codes',
              include: `${term}.*`,
              size: 50,
              order: { _key: 'asc' },
            },
          },
        },
      };

      const response = await fetch(`${url}/mobilenote_data/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });

      const data = await response.json();
      const buckets: Array<{ key: string }> = data?.aggregations?.postal_codes?.buckets ?? [];

      return { options: buckets.map(({ key }) => ({ value: key, label: key })) };
    },
    [url],
  );
};

export const PostalCodeFilter = () => {
  const setPostalCodes = useSetAtom(postalCodesAtom);
  const getPostalCodesValue = useAtomCallback(useCallback((get) => get(postalCodesAtom), []));
  const onSearch = usePostalCodeSuggestions();

  const onChange = (selectedOptions: Option[]) => {
    setPostalCodes(selectedOptions);
    selectStorage.updateAllOptions((option) => ({
      ...option,
      selected: selectedOptions.some((selection) => selection.value === option.value),
    }));
  };

  const id = 'postal-codes';
  const [storageKey, setStorageKey] = useState(0);

  const selectStorage = useSelectStorage({
    disabled: false,
    id,
    invalid: false,
    multiSelect: true,
    noTags: true,
    onChange,
    onSearch,
    open: false,
    updateKey: String(storageKey),
    options: getPostalCodesValue()?.map((dm) => ({ ...dm, selected: true })) ?? [],
    clearable: true,
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(selectStorage);
    // Force reload to prevent stale internal state.
    setStorageKey((key) => key + 1);
  };

  const updateSelections = () => {
    updateSelectionsInStorage(selectStorage, getPostalCodesValue());
  };

  useEffect(() => {
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);

    return () => {
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);
    };
  });

  const selectLabel = Drupal.t('Postal code', {}, { context: 'Vehicle removal search' });

  return (
    <Select
      className='hdbt-search__dropdown'
      texts={{
        label: selectLabel,
        placeholder: Drupal.t('All', {}, { context: 'Vehicle removal search' }),
        searchLabel: Drupal.t('Write a postal code', {}, { context: 'Vehicle removal search' }),
        searchPlaceholder: Drupal.t('For example, 00100', {}, { context: 'Vehicle removal search' }),
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': selectLabel },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': selectLabel },
          { context: 'React search clear selection label' },
        ),
      }}
      theme={defaultMultiSelectTheme}
      {...(selectStorage.getProps() as SelectProps<ReactElement<HTMLOptGroupElement | HTMLOptionElement>>)}
    />
  );
};
