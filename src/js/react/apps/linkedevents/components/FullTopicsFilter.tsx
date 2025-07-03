import { Select, SelectData, useSelectStorage } from 'hds-react';
import { useSetAtom } from 'jotai';
import { memo, useCallback, useEffect } from 'react';
import { useAtomCallback } from 'jotai/utils';
import type OptionType from '../types/OptionType';

import { topicSelectionAtom, updateParamsAtom} from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import { LinkedEventsTopic } from '@/types/LinkedEvents';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import LinkedEvents from '@/react/common/enum/LinkedEvents';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';

const FullTopicsFilter = memo(() => {
  const setTopicsFilter = useSetAtom(topicSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const getTopicsParamValue = useAtomCallback(
    useCallback((get) => get(topicSelectionAtom), [])
  );

  const getTopics = async (
    searchTerm: string,
    selectedOptions: OptionType[],
    data: SelectData,
  ) => {
    const url = new URL(LinkedEvents.KEYWORDS_URL);
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
      const places = body.data.map((place: LinkedEventsTopic) => ({
        value: place.id,
        label: getNameTranslation(place.name, drupalSettings.path.currentLanguage)
      }));

      result.options = places;
      return result;
    }

    return result;
  };

  const onChange = (selectedOptions: OptionType[], clickedOption?: OptionType) => {
    setTopicsFilter(selectedOptions);
    updateParams({ [ApiKeys.KEYWORDS]: selectedOptions.map((topic: any) => topic.value).join(',') });

    storage.updateAllOptions((option, group, groupindex) => ({
        ...option,
        selected: selectedOptions.some(selection => selection.value === option.value),
      }));

    if (clickedOption) {
      storage.setOpen(true);
    }
  };

  const selectLabel: string = Drupal.t('Topic', {}, { context: 'React search: topics filter' });

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
    window.addEventListener(`eventsearch-clear-${ApiKeys.KEYWORDS}`, updateSelections);

    return () => {
      window.addEventListener('eventsearch-clear', clearAllSelections);
      window.removeEventListener(`eventsearch-clear-${ApiKeys.KEYWORDS}`, updateSelections);
    };
  });

  return (
    <div className='hdbt-search__filter event-form__filter--topics'>
      {/* @ts-ignore */}
      <Select
        className='hdbt-search__dropdown'
        texts={{
          label: selectLabel,
          placeholder: Drupal.t('All topics', {}, { context: 'React search: topics filter' }),
          searchLabel: Drupal.t('Search term', {}, { context: 'React search: all available options' }),
          searchPlaceholder: Drupal.t('For example, Music', {}, { context: 'React search: all available options' }),
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

export default FullTopicsFilter;
