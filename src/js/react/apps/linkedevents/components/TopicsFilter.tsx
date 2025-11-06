import { Select } from 'hds-react';
import { useSelectStorage } from 'hds-react/components/select';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import { clearAllSelectionsFromStorage } from '@/react/common/helpers/HDS';
import useSelectedOptions from '@/react/common/hooks/useSelectedOptions';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import { topicSelectionAtom, topicsAtom, updateParamsAtom } from '../store';
import type OptionType from '../types/OptionType';

function TopicsFilter() {
  const topics = useAtomValue(topicsAtom);
  const [topicSelection, setTopicsFilter] = useAtom(topicSelectionAtom);
  const selectedOptions = useSelectedOptions(topics, topicSelection);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (value: OptionType[], _clickedOption?: OptionType) => {
    setTopicsFilter(value);
    updateParams({
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
      [ApiKeys.KEYWORDS]: value.map((topic: any) => topic.value).join(','),
    });
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
    options: selectedOptions,
    texts: {
      label: selectLabel,
      language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
      placeholder: Drupal.t(
        'All topics',
        {},
        { context: 'React search: topics filter' },
      ),
    },
    theme: defaultSelectTheme,
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(storage);
  };

  const updateSelections = () => {
    storage.updateAllOptions((option, _group, _groupindex) => {
      if (
        option.selected &&
        !topicSelection.some((selection) => selection.value === option.value)
      ) {
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
    window.addEventListener(
      `eventsearch-clear-${SearchComponents.TOPICS}`,
      updateSelections,
    );

    return () => {
      window.addEventListener('eventsearch-clear', clearAllSelections);
      window.removeEventListener(
        `eventsearch-clear-${SearchComponents.TOPICS}`,
        updateSelections,
      );
    };
  });

  return (
    <div className='hdbt-search__filter event-form__filter--topics'>
      {/* @ts-ignore */}
      <Select className='hdbt-search__dropdown' {...storage.getProps()} />
    </div>
  );
}

export default TopicsFilter;
