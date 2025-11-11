import { Select, type SelectData } from 'hds-react';
import { useSelectStorage } from 'hds-react/components/select';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { memo, useCallback, useEffect } from 'react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import LinkedEvents from '@/react/common/enum/LinkedEvents';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import {
  clearAllSelectionsFromStorage,
  updateSelectionsInStorage,
} from '@/react/common/helpers/HDS';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import type { LinkedEventsTopic } from '@/types/LinkedEvents';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import { topicSelectionAtom, updateParamsAtom } from '../store';
import type OptionType from '../types/OptionType';

const FullTopicsFilter = memo(() => {
  const setTopicsFilter = useSetAtom(topicSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const getTopicsParamValue = useAtomCallback(
    useCallback((get) => get(topicSelectionAtom), []),
  );

  const getTopics = async (
    searchTerm: string,
    _selectedOptions: OptionType[],
    _data: SelectData,
  ) => {
    const url = new URL(LinkedEvents.KEYWORDS_URL);
    const locationParams = new URLSearchParams({
      has_upcoming_events: 'true',
      text: searchTerm,
    });
    url.search = locationParams.toString();
    const result = { options: [] };

    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12501
    const response = await useTimeoutFetch(url.toString());

    if (response.status !== 200) {
      return result;
    }

    const body = await response.json();

    if (body.data?.length) {
      const places = body.data.map((place: LinkedEventsTopic) => ({
        value: place.id,
        label: getNameTranslation(
          place.name,
          drupalSettings.path.currentLanguage,
        ),
      }));

      result.options = places;
      return result;
    }

    return result;
  };

  const onChange = (
    selectedOptions: OptionType[],
    clickedOption?: OptionType,
  ) => {
    setTopicsFilter(selectedOptions);
    updateParams({
      [ApiKeys.KEYWORDS]: selectedOptions
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
        .map((topic: any) => topic.value)
        .join(','),
    });

    storage.updateAllOptions((option, _group, _groupindex) => ({
      ...option,
      selected: selectedOptions.some(
        (selection) => selection.value === option.value,
      ),
    }));

    if (clickedOption) {
      storage.setOpen(true);
    }
  };

  const selectLabel: string = Drupal.t(
    'Topic',
    {},
    { context: 'React search: topics filter' },
  );

  const storage = useSelectStorage({
    id: SearchComponents.TOPICS,
    multiSelect: true,
    noTags: true,
    onChange,
    onSearch: getTopics,
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(storage);
  };

  const updateSelections = () => {
    updateSelectionsInStorage(storage, getTopicsParamValue());
  };

  useEffect(() => {
    window.addEventListener('eventsearch-clear', clearAllSelections);
    window.addEventListener(
      `eventsearch-clear-${ApiKeys.KEYWORDS}`,
      updateSelections,
    );

    return () => {
      window.addEventListener('eventsearch-clear', clearAllSelections);
      window.removeEventListener(
        `eventsearch-clear-${ApiKeys.KEYWORDS}`,
        updateSelections,
      );
    };
  });

  return (
    <div className='hdbt-search__filter event-form__filter--topics'>
      {/* @ts-ignore */}
      <Select
        className='hdbt-search__dropdown'
        texts={{
          label: selectLabel,
          language: getCurrentLanguage(
            window.drupalSettings.path.currentLanguage,
          ),
          placeholder: Drupal.t(
            'All topics',
            {},
            { context: 'React search: topics filter' },
          ),
          searchLabel: Drupal.t(
            'Search term',
            {},
            { context: 'React search: all available options' },
          ),
          searchPlaceholder: Drupal.t(
            'For example, Music',
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

export default FullTopicsFilter;
