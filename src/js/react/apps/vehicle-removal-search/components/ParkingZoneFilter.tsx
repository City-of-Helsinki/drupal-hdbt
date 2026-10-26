import type { estypes } from '@elastic/elasticsearch';
import type { SelectProps } from 'hds-react';
import { type Option, type SearchFunction, Select, useSelectStorage } from 'hds-react';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';
import { Events } from '../enum/Event';
import { parkingZonesAtom } from '../store';
import type VehicleRemoval from '../types/VehicleRemoval';

type ParkingZoneSuggestionsResponse = estypes.SearchResponse<
  VehicleRemoval,
  Record<'parking_zone_names', estypes.AggregationsStringTermsAggregate>
>;

/**
 * Build a case-insensitive regex for the terms aggregation include.
 *
 * Parking zone names are Finnish and may combine several parts of the city,
 * so the term is matched anywhere in the name. Only letters, numbers, spaces,
 * hyphens and slashes are kept, and the non-alphanumeric ones are escaped so
 * that it is safe to use in a regex.
 */
const toIncludePattern = (searchTerm: string): string => {
  const term = searchTerm.replace(/[^\p{L}\p{N} /-]/gu, '').trim();

  if (!term) {
    return '';
  }

  const pattern = Array.from(term)
    .map((char) => {
      if (char === ' ' || char === '-' || char === '/') {
        return `\\${char}`;
      }
      const lower = char.toLowerCase();
      const upper = char.toUpperCase();
      return lower === upper ? char : `[${lower}${upper}]`;
    })
    .join('');

  return `.*${pattern}.*`;
};

/**
 * Query parking zone suggestions from the parking zones present in the index.
 */
const useParkingZoneSuggestions = () => {
  const url = drupalSettings?.helfi_react_search?.elastic_proxy_url;

  return useCallback<SearchFunction>(
    async (searchTerm, _selectedOptions, _data) => {
      const include = toIncludePattern(searchTerm);

      if (!include) {
        return { options: [] };
      }

      const query = {
        size: 0,
        aggs: {
          parking_zone_names: {
            terms: {
              field: 'parking_zone_names',
              include,
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

      const data: ParkingZoneSuggestionsResponse = await response.json();
      const buckets = data.aggregations?.parking_zone_names?.buckets ?? [];
      // Buckets are an array unless the aggregation is keyed.
      const names = (Array.isArray(buckets) ? buckets : Object.values(buckets)).map(({ key }) => String(key));

      return { options: names.map((name) => ({ value: name, label: name })) };
    },
    [url],
  );
};

export const ParkingZoneFilter = () => {
  const setParkingZones = useSetAtom(parkingZonesAtom);
  const getParkingZonesValue = useAtomCallback(useCallback((get) => get(parkingZonesAtom), []));
  const onSearch = useParkingZoneSuggestions();

  const onChange = (selectedOptions: Option[]) => {
    setParkingZones(selectedOptions);
    selectStorage.updateAllOptions((option) => ({
      ...option,
      selected: selectedOptions.some((selection) => selection.value === option.value),
    }));
  };

  const id = 'parking-zones';
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
    options: getParkingZonesValue()?.map((dm) => ({ ...dm, selected: true })) ?? [],
    clearable: true,
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(selectStorage);
    // Force reload to prevent stale internal state.
    setStorageKey((key) => key + 1);
  };

  const updateSelections = () => {
    updateSelectionsInStorage(selectStorage, getParkingZonesValue());
  };

  useEffect(() => {
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);

    return () => {
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);
    };
  });

  const selectLabel = Drupal.t('Parking zone', {}, { context: 'Vehicle removal search' });

  return (
    <Select
      className='hdbt-search__dropdown'
      texts={{
        label: selectLabel,
        placeholder: Drupal.t('All', {}, { context: 'Vehicle removal search' }),
        searchLabel: Drupal.t('Write a parking zone', {}, { context: 'Vehicle removal search' }),
        searchPlaceholder: Drupal.t('For example, Kamppi', {}, { context: 'Vehicle removal search' }),
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
