import { Select, SelectData, useSelectStorage } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { memo, useEffect, useState } from 'react';
import type OptionType from '../types/OptionType';

import { topicsAtom, topicSelectionAtom, updateParamsAtom} from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import { LinkedEventsTopic } from '@/types/LinkedEvents';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import LinkedEvents from '@/react/common/enum/LinkedEvents';

const FullTopicsFilter = memo(() => {
  const [updateKey, setUpdateKey] = useState<string>('0');
  const setTopicsFilter = useSetAtom(topicSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

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
  };

  const selectLabel: string = Drupal.t('Event topic', {}, { context: 'React search: topics filter' });

  const storage = useSelectStorage({
    id: SearchComponents.TOPICS,
    multiSelect: true,
    noTags: true,
    onChange,
    onSearch: getTopics,
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
    <div className='hdbt-search__filter event-form__filter--topics'>
      <Select
        className='hdbt-search__dropdown'
        texts={{
          clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': selectLabel}, { context: 'React search clear selection label' }),
          clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': selectLabel}, { context: 'React search clear selection label' }),
          label: selectLabel,
          placeholder: Drupal.t('All topics', {}, { context: 'React search: topics filter' }),
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
