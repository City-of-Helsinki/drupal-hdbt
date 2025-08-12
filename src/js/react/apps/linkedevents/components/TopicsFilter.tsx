import { Select, useSelectStorage } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import type OptionType from '../types/OptionType';

import { topicsAtom, topicSelectionAtom, updateParamsAtom} from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';
import useSelectedOptions from '@/react/common/hooks/useSelectedOptions';
import { clearAllSelectionsFromStorage } from '@/react/common/helpers/HDS';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';

function TopicsFilter() {
  const topics = useAtomValue(topicsAtom);
  const [topicSelection, setTopicsFilter] = useAtom(topicSelectionAtom);
  const selectedOptions = useSelectedOptions(topics, topicSelection);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (value: OptionType[], clickedOption?: OptionType) => {
    setTopicsFilter(value);
    updateParams({ [ApiKeys.KEYWORDS]: value.map((topic: any) => topic.value).join(',') });
  };

  const selectLabel: string = Drupal.t('Topic', {}, { context: 'React search: topics filter' });

  const storage = useSelectStorage({
    id: SearchComponents.TOPICS,
    multiSelect: true,
    noTags: true,
    onChange,
    options: selectedOptions,
    texts: {
      label: selectLabel,
      language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
      placeholder: Drupal.t('All topics', {}, { context: 'React search: topics filter' }),
    },
    theme: defaultSelectTheme
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(storage);
  };

  const updateSelections = () => {
    storage.updateAllOptions((option, group, groupindex) => {
      if (option.selected && !topicSelection.some(selection => selection.value === option.value)) {
        return {
          ...option,
          selected: false,
        };
      }
      return option;
    });
    storage.render();
  };

  useEffect(() => {
    window.addEventListener(`eventsearch-clear-${SearchComponents.TOPICS}`, updateSelections);

    return () => {
      window.addEventListener('eventsearch-clear', clearAllSelections);
      window.removeEventListener(`eventsearch-clear-${SearchComponents.TOPICS}`, updateSelections);
    };
  });

  return (
    <div className='hdbt-search__filter event-form__filter--topics'>
      {/* @ts-ignore */}
      <Select
        className='hdbt-search__dropdown'
        {...storage.getProps()}
      />
    </div>
  );
}

export default TopicsFilter;
