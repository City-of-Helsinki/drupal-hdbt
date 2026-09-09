import { type OptionInProps, Select } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import SearchComponents from '../enum/SearchComponents';
import { getTaskAreasAtom, setFilterValueAtom, taskAreasAtom } from '../store';
import type { OptionType } from '../types/OptionType';

const taskAreasLabel: string = Drupal.t('Task area', {}, { context: 'Task areas filter label' });

export const TaskAreaFilter = () => {
  const taskAreaOptions = useAtomValue(taskAreasAtom);
  const value = useAtomValue(getTaskAreasAtom);
  const setFilterValue = useSetAtom(setFilterValueAtom);

  return (
    <Select
      className='job-search-form__dropdown'
      clearable
      id={SearchComponents.TASK_AREAS}
      multiSelect
      noTags
      onChange={(selectedOptions) => {
        setFilterValue({ key: SearchComponents.TASK_AREAS, value: selectedOptions as OptionType[] });
      }}
      options={taskAreaOptions as OptionInProps[]}
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
        placeholder: Drupal.t('All fields', {}, { context: 'Task areas filter placeholder' }),
      }}
      value={value as OptionInProps[]}
      theme={defaultMultiSelectTheme}
    />
  );
};
