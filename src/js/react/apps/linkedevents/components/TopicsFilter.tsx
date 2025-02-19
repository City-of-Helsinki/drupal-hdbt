import { Select } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import type OptionType from '../types/OptionType';

import { topicsAtom, topicSelectionAtom, updateParamsAtom} from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';

function TopicsFilter() {
  const topics = useAtomValue(topicsAtom);
  const [topicSelection, setTopicsFilter] = useAtom(topicSelectionAtom);
  const [topicsSelectOpen, setTopicSelectOpen] = useState(false);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (selectedOptions: OptionType[], clickedOption?: OptionType) => {
    setTopicsFilter(selectedOptions);
    if (clickedOption) setTopicSelectOpen(true);
    updateParams({ [ApiKeys.KEYWORDS]: selectedOptions.map((topic: any) => topic.value).join(',') });
  };

  const selectLabel: string = Drupal.t('Event topic', {}, { context: 'React search: topics filter' });

  return (
    <div className='hdbt-search__filter event-form__filter--topics'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.TOPICS}
        multiSelect
        noTags
        onBlur={() => setTopicSelectOpen(false)}
        onChange={onChange}
        open={topicsSelectOpen}
        options={topics}
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
        value={topicSelection}
      />
    </div>
  );
}

export default TopicsFilter;
