import { type OptionInProps, Select } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';
import SearchComponents from '../enum/SearchComponents';
import { getLanguageAtom, languagesAtom, setFilterValueAtom } from '../store';

const languageLabel: string = Drupal.t('Language', {}, { context: 'Language filter label' });

export const LanguageFilter = () => {
  const languageOptions = useAtomValue(languagesAtom);
  const setFilterValue = useSetAtom(setFilterValueAtom);
  const value = useAtomValue(getLanguageAtom);

  return (
    <Select
      className='job-search-form__dropdown'
      clearable
      id={SearchComponents.LANGUAGE}
      noTags
      onChange={(selectedOptions) => {
        setFilterValue({ key: SearchComponents.LANGUAGE, value: selectedOptions });
      }}
      options={languageOptions as OptionInProps[]}
      texts={{
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': languageLabel },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': languageLabel },
          { context: 'React search clear selection label' },
        ),
        label: languageLabel,
        language: window.drupalSettings.path.currentLanguage,
        placeholder: Drupal.t('All languages', {}, { context: 'Language placeholder' }),
      }}
      value={value as OptionInProps[]}
      theme={defaultSelectTheme}
    />
  );
};
