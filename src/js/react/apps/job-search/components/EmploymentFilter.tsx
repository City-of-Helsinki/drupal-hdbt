import { useAtomValue, useSetAtom } from 'jotai';
import { employmentAtom, getEmploymentAtom, setStateValueAtom } from '../store';
import { Select } from 'hds-react';
import SearchComponents from '../enum/SearchComponents';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';

const employmentRelationshipLabel: string = Drupal.t(
  'Employment type',
  {},
  { context: 'Employment filter label' },
);

export const EmploymentFilter = () => {
  const employmentOptions = useAtomValue(employmentAtom);
  const value = useAtomValue(getEmploymentAtom);
  const setStateValue = useSetAtom(setStateValueAtom);

  return (
    <Select
      className='job-search-form__dropdown'
      clearable
      id={SearchComponents.EMPLOYMENT}
      multiSelect
      noTags
      onChange={(selectedOptions) =>
        setStateValue({
          key: SearchComponents.EMPLOYMENT,
          value: selectedOptions,
        })
      }
      options={employmentOptions}
      texts={{
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': employmentRelationshipLabel },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': employmentRelationshipLabel },
          { context: 'React search clear selection label' },
        ),
        label: employmentRelationshipLabel,
        language: window.drupalSettings.path.currentLanguage,
        placeholder: Drupal.t(
          'All types of employment',
          {},
          { context: 'Employment filter placeholder' },
        ),
      }}
      value={value}
      theme={defaultMultiSelectTheme}
    />
  );
};
