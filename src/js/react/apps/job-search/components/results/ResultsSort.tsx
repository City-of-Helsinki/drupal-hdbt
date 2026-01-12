import { Select } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import Global from '../../enum/Global';
import type OptionType from '../../types/OptionType';
import { setSortAtom, submittedStateAtom } from '../../store';

const { sortOptions } = Global;
const options: OptionType[] = [
  {
    label: Drupal.t('Newest first', {}, { context: 'Job search' }),
    value: sortOptions.newestFirst,
  },
  {
    label: Drupal.t('Closing date first', {}, { context: 'Job search' }),
    value: sortOptions.closing,
  },
];

const ResultsSort = () => {
  const submittedState = useAtomValue(submittedStateAtom);
  const setSort = useSetAtom(setSortAtom);

  return (
    <Select
      className='job-listing-search__sort'
      clearable={false}
      onChange={(_selectedOptions, clickedOption) => {
        setSort(clickedOption?.value || sortOptions.newestFirst);
      }}
      options={options}
      texts={{
        label: Drupal.t(
          'Sort search results',
          {},
          { context: 'HELfi Rekry job search' },
        ),
        language: getCurrentLanguage(
          window.drupalSettings.path.currentLanguage,
        ),
      }}
      value={[
        options.find((option) => option.value === submittedState.sort) ||
          options[0],
      ]}
      theme={defaultSelectTheme}
    />
  );
};

export default ResultsSort;
