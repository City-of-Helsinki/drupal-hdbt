import { Select } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import SearchComponents from '../enum/SearchComponents';
import { TargetGroups } from '../enum/TargetGroups';
import { targetGroupsToParams } from '../helpers/TargetGroupsToParams';
import { useScopedId } from '../hooks/useScopedId';
import { targetGroupsAtom, updateParamsAtom } from '../store';
import type OptionType from '../types/OptionType';

export const TargetGroupFilter = () => {
  const [targetGroupSelection, setTargetGroups] = useAtom(targetGroupsAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (selectedGroups: OptionType[]) => {
    setTargetGroups(selectedGroups);
    updateParams(targetGroupsToParams(selectedGroups));
  };

  const getOptions = () => Object.entries(TargetGroups).map(([label, _value]) => ({ label, value: label }));

  const selectLabel = Drupal.t('Age group', {}, { context: 'Event search: target group label' });

  const targetGroupsId = useScopedId(SearchComponents.TARGET_GROUPS);

  return (
    <div className='hdbt-search__filter'>
      <Select
        className='hdbt-search__dropdown'
        id={targetGroupsId}
        noTags
        clearable
        onChange={onChange}
        options={getOptions()}
        texts={{
          clearButtonAriaLabel_one: Drupal.t(
            'Clear @label selection',
            { '@label': selectLabel },
            { context: 'React search clear selection label' },
          ),
          clearButtonAriaLabel_multiple: Drupal.t(
            'Clear @label selection',
            { '@label': selectLabel },
            { context: 'React search clear selection label' },
          ),
          label: selectLabel,
          language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
          placeholder: Drupal.t('All age groups', {}, { context: 'Event search: target group placeholder' }),
        }}
        theme={defaultSelectTheme}
        value={targetGroupSelection}
      />
    </div>
  );
};
