import { type OptionInProps, Select, useSelectStorage } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import { clearAllSelectionsFromStorage } from '@/react/common/helpers/HDS';
import useSelectedOptions from '@/react/common/hooks/useSelectedOptions';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import { useAtomListener } from '../hooks/useAtomListener';
import { useScopedId } from '../hooks/useScopedId';
import { clearFilterSignalAtom, clearSignalAtom, topicSelectionAtom, topicsAtom, updateParamsAtom } from '../store';
import type OptionType from '../types/OptionType';

function TopicsFilter() {
  const topics = useAtomValue(topicsAtom);
  const [topicSelection, setTopicsFilter] = useAtom(topicSelectionAtom);
  const selectedOptions = useSelectedOptions(topics, topicSelection);
  const updateParams = useSetAtom(updateParamsAtom);
  const topicsId = useScopedId(SearchComponents.TOPICS);
  const getTopicSelection = useAtomCallback(useCallback((get) => get(topicSelectionAtom), []));

  const onChange = (value: OptionType[], _clickedOption?: OptionType) => {
    setTopicsFilter(value);
    updateParams({
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      [ApiKeys.KEYWORDS]: value.map((topic: any) => topic.value).join(','),
    });
  };

  const selectLabel: string = Drupal.t('Topic', {}, { context: 'React search: topics filter' });

  const storage = useSelectStorage({
    id: topicsId,
    multiSelect: true,
    noTags: true,
    onChange,
    options: selectedOptions as OptionInProps[],
    texts: {
      label: selectLabel,
      language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
      placeholder: Drupal.t('All topics', {}, { context: 'React search: topics filter' }),
    },
    theme: defaultSelectTheme,
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(storage);
  };

  const updateSelections = () => {
    storage.updateAllOptions((option, _group, _groupindex) => {
      if (option.selected && !getTopicSelection().some((selection) => selection.value === option.value)) {
        return { ...option, selected: false };
      }
      return option;
    });
    storage.render();
  };

  useAtomListener(clearSignalAtom, clearAllSelections);
  useAtomListener(clearFilterSignalAtom, (signal) => {
    if (signal?.key === ApiKeys.KEYWORDS) {
      updateSelections();
    }
  });

  return (
    <div className='hdbt-search__filter event-form__filter--topics'>
      {/* @ts-ignore */}
      <Select className='hdbt-search__dropdown' {...storage.getProps()} />
    </div>
  );
}

export default TopicsFilter;
