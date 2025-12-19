import { useAtomValue, useSetAtom } from 'jotai';
import { getTaskAreasAtom, setStateValueAtom, taskAreasAtom } from '../store';
import { Select } from 'hds-react';
import SearchComponents from '../enum/SearchComponents';
import { OptionType } from '../types/OptionType';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';

const taskAreasLabel: string = Drupal.t(
  'Task area',
  {},
  { context: 'Task areas filter label' },
);

export const TaskAreaFilter = () => {
  const taskAreaOptions = useAtomValue(taskAreasAtom);
  const value = useAtomValue(getTaskAreasAtom);
  const setStateValue = useSetAtom(setStateValueAtom);

  return (
    <Select
      className='job-search-form__dropdown'
      clearable
      id={SearchComponents.TASK_AREAS}
      multiSelect
      noTags
      onChange={(selectedOptions) => {
        setStateValue({
          key: SearchComponents.TASK_AREAS,
          value: selectedOptions as OptionType[],
        });
      }}
      options={taskAreaOptions}
      texts={{
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': taskAreasLabel },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': taskAreasLabel },
          { context: 'React search clear selection label' },
        ),
        label: taskAreasLabel,
        language: window.drupalSettings.path.currentLanguage,
        placeholder: Drupal.t(
          'All fields',
          {},
          { context: 'Task areas filter placeholder' },
        ),
      }}
      value={value}
      theme={defaultMultiSelectTheme}
    />
  );
};
