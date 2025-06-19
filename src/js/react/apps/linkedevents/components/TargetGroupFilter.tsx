import { Select } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';

import { targetGroupsAtom, updateParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import { TargetGroups } from '../enum/TargetGroups';
import OptionType from '../types/OptionType';
import { targetGroupsToParams } from '../helpers/TargetGroupsToParams';

export const TargetGroupFilter = () => {
  const [targetGroupSelection, setTargetGroups] = useAtom(targetGroupsAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (selectedGroups: OptionType[]) => {
    setTargetGroups(selectedGroups);
    updateParams(targetGroupsToParams(selectedGroups));
  };

  const getOptions = () => Object.entries(TargetGroups).map(([label, value]) => ({
    label,
    value: label,
  }));

  const selectLabel = Drupal.t('Event target group', {}, {context: 'Event search: target group label'});

  return (
    <div className='hdbt-search__filter'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.TARGET_GROUPS}
        noTags
        onChange={onChange}
        options={getOptions()}
        texts={{
          clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': selectLabel}, { context: 'React search clear selection label' }),
          clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': selectLabel}, { context: 'React search clear selection label' }),
          label: selectLabel,
          placeholder: Drupal.t('All target groups', {}, {context: 'Event search: target group placeholder'}),
        }}
        theme={{
          '--checkbox-background-selected': 'var(--hdbt-color-black)',
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--placeholder-color': 'var(--hdbt-color-black)',
        }}
        value={targetGroupSelection}
      />
    </div>
  );
};
