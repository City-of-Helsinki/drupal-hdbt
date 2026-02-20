import { Select } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import ApiKeys from '../enum/ApiKeys';
import { LanguageOptions } from '../enum/LanguageOptions';
import SearchComponents from '../enum/SearchComponents';
import { languageAtom, updateParamsAtom } from '../store';
import type OptionType from '../types/OptionType';
import { getDefaultSelectTexts } from '@/react/common/helpers/Texts';

export const LanguageFilter = ({
  labelOverride,
  placeholderOverride,
  includeLanguages,
}: {
  labelOverride?: string;
  placeholderOverride?: string;
  includeLanguages?: string[];
}) => {
  const [languageSelection, setLanguage] = useAtom(languageAtom);
  const updateParams = useSetAtom(updateParamsAtom);
  const languageOptions = Object.entries(LanguageOptions).map(([key, value]) => ({ label: value, value: key }));
  const filteredLanguageOptions = includeLanguages
    ? languageOptions.filter((option) => includeLanguages.includes(option.value))
    : languageOptions;
  const onChange = (selectedOptions: OptionType[]) => {
    setLanguage(selectedOptions);
    updateParams({
      [ApiKeys.LANGUAGE]: selectedOptions.map((language) => language.value).join(','),
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
        options={filteredLanguageOptions}
        texts={{
          ...getDefaultSelectTexts(labelOverride || selectLanguageLabel),
          placeholder: placeholderOverride || Drupal.t('All languages', {}, { context: 'Language placeholder' }),
        }}
        theme={defaultMultiSelectTheme}
        value={languageSelection}
      />
    </div>
  );
};
