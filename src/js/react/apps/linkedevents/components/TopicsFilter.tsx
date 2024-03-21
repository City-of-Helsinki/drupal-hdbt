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
        clearButtonAriaLabel={Drupal.t('Clear @label selection', {'@label': selectLabel}, { context: 'React search clear selection label' })}
        label={selectLabel}
        multiselect
        // @ts-ignore
        options={topics}
        value={topicSelection}
        id={SearchComponents.TOPICS}
        onChange={onChange}
        placeholder={Drupal.t('All topics', {}, { context: 'React search: topics filter' })}
        selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'React search: remove item aria label' })}
        theme={{
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
          '--placeholder-color': 'var(--hdbt-color-black)',
        }}
      />
    </div>
  );
}

export default TopicsFilter;
