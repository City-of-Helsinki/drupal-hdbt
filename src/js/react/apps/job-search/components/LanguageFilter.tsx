import { useAtomValue, useSetAtom } from 'jotai';
import { getLanguageAtom, languagesAtom, setStateValueAtom } from '../store';
import { Select } from 'hds-react';
import SearchComponents from '../enum/SearchComponents';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';

const languageLabel: string = Drupal.t('Language', {}, { context: 'Language filter label' });

export const LanguageFilter = () => {
  const languageOptions = useAtomValue(languagesAtom);
  const setStateValue = useSetAtom(setStateValueAtom);
  const value = useAtomValue(getLanguageAtom);

  return (
    <Select
      className='job-search-form__dropdown'
      clearable
      id={SearchComponents.LANGUAGE}
      noTags
      onChange={(selectedOptions) => {
        setStateValue({ key: SearchComponents.LANGUAGE, value: selectedOptions });
      }}
      options={languageOptions}
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
      value={value}
      theme={defaultSelectTheme}
    />
  );
};
