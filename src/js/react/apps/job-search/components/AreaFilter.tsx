import { useAtomValue, useSetAtom } from 'jotai';
import { areaFilterAtom, getAreaAtom, setStateValueAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import { Select } from 'hds-react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';

const areaFilterLabel: string = Drupal.t(
  'Job location',
  {},
  { context: 'Job search: Job location label' },
);

export const AreaFilter = () => {
  const areaOptions = useAtomValue(areaFilterAtom);
  const setStateValue = useSetAtom(setStateValueAtom);
  const value = useAtomValue(getAreaAtom);

  return (
    <Select
      className='job-search-form__dropdown'
      clearable
      id={SearchComponents.AREA_FILTER}
      multiSelect
      noTags
      onChange={(selectedOptions) => {
        setStateValue({
          key: SearchComponents.AREA_FILTER,
          value: selectedOptions,
        });
      }}
      options={areaOptions}
      value={value}
      texts={{
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': areaFilterLabel },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': areaFilterLabel },
          { context: 'React search clear selection label' },
        ),
        label: areaFilterLabel,
        language: window.drupalSettings.path.currentLanguage,
        placeholder: Drupal.t(
          'All areas',
          {},
          { context: 'Location placeholder' },
        ),
      }}
      theme={defaultMultiSelectTheme}
    />
  );
};
