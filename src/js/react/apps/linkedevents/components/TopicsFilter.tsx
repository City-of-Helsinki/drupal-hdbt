import { Select } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';

import { topicsAtom, topicSelectionAtom, updateParamsAtom} from '../store';
import SearchComponents from '../enum/SearchComponents';
import ApiKeys from '../enum/ApiKeys';

function TopicsFilter() {
  const topics = useAtomValue(topicsAtom);
  const [topicSelection, setTopicsFilter] = useAtom(topicSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (value: any) => {
    setTopicsFilter(value);
    updateParams({ [ApiKeys.KEYWORDS]: value.map((topic: any) => topic.value).join(',') });
  };

  const selectLabel: string = Drupal.t('Event topic', {}, { context: 'React search: topics filter' });

  return (
    <div className='hdbt-search__filter event-form__filter--topics'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.TOPICS}
        multiSelect
        onChange={onChange}
        options={topics}
        theme={{
          '--checkbox-background-selected': 'var(--hdbt-color-black)',
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--placeholder-color': 'var(--hdbt-color-black)',
        }}
        texts={{
          clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': selectLabel}, { context: 'React search clear selection label' }),
          clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': selectLabel}, { context: 'React search clear selection label' }),
          label: selectLabel,
          placeholder: Drupal.t('All topics', {}, { context: 'School search: language placeholder' }),
        }}
        value={topicSelection}
      />
    </div>
  );
}

export default TopicsFilter;
