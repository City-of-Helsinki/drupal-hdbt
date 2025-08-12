import { Select } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect , useState } from 'react';

import Global from '../../enum/Global';
import { urlAtom, urlUpdateAtom } from '../../store';
import type OptionType from '../../types/OptionType';
import {getCurrentLanguage} from '@/react/common/helpers/GetCurrentLanguage';

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
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);
  const [sort, setSort] = useState<OptionType>(options[0]);

  useEffect(() => {
    if (urlParams.sort) {
      const matchedSort = options.find((option: OptionType) => option.value === urlParams.sort);

      if (matchedSort) {
        setSort(matchedSort);
      }
    }
  }, []);
  return (
    <Select
      className='job-listing-search__sort'
      clearable={false}
      onChange={(_selectedOptions, clickedOption) => {
        setSort(clickedOption);
        setUrlParams({
          ...urlParams,
          sort: clickedOption.value,
        });
      }}
      options={options}
      texts={{
        label: Drupal.t('Sort search results', {}, { context: 'HELfi Rekry job search' }),
        language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
      }}
      value={[sort]}
    />
  );
};

export default ResultsSort;
