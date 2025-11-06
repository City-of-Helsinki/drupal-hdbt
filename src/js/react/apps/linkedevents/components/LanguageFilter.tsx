import { Select } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import ApiKeys from '../enum/ApiKeys';
import { LanguageOptions } from '../enum/LanguageOptions';
import SearchComponents from '../enum/SearchComponents';
import { languageAtom, updateParamsAtom } from '../store';
import type OptionType from '../types/OptionType';

export const LanguageFilter = () => {
  const [languageSelection, setLanguage] = useAtom(languageAtom);
  const updateParams = useSetAtom(updateParamsAtom);
  const languageOptions = Object.entries(LanguageOptions).map(([key, value]) => ({
    label: value,
    value: key,
  }));
  const onChange = (selectedOptions: OptionType[]) => {
    setLanguage(selectedOptions);
    updateParams({
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
      [ApiKeys.LANGUAGE]: selectedOptions.map((language: any) => language.value).join(','),
    });
  };

  const selectLanguageLabel: string = Drupal.t('Language', {}, { context: 'React search' });

  return (
    <div className='hdbt-search__filter'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.LANGUAGE}
        multiSelect
        noTags
        onChange={onChange}
        options={languageOptions}
        texts={{
          clearButtonAriaLabel_one: Drupal.t(
            'Clear @label selection',
            { '@label': selectLanguageLabel },
            { context: 'React search clear selection label' },
          ),
          clearButtonAriaLabel_multiple: Drupal.t(
            'Clear @label selection',
            { '@label': selectLanguageLabel },
            { context: 'React search clear selection label' },
          ),
          label: selectLanguageLabel,
          language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
          placeholder: Drupal.t('All languages', {}, { context: 'Language placeholder' }),
        }}
        theme={defaultMultiSelectTheme}
        value={languageSelection}
      />
    </div>
  );
};
