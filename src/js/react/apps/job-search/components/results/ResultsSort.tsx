import { Select } from 'hds-react';
import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect , useState } from 'react';

import Global from '../../enum/Global';
import { urlAtom, urlUpdateAtom } from '../../store';
import type OptionType from '../../types/OptionType';

const { sortOptions } = Global;
const options: OptionType[] = [
  {
    label: Drupal.t('Newest first', {}, { context: 'Job search' }),
    value: sortOptions.newestFirst,
  },
  {
    label: Drupal.t('Closing date', {}, { context: 'Job search' }),
    value: sortOptions.closing,
  },
];

const ResultsSort = () => {
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useUpdateAtom(urlUpdateAtom);
  const [sort, setSort] = useState<OptionType>(options[1]);

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
      label={Drupal.t('Sort by', {}, { context: 'HELfi Rekry job search' })}
      options={options}
      onChange={(option: OptionType) => {
        setSort(option);
        setUrlParams({
          ...urlParams,
          sort: option.value,
        });
      }}
      value={sort}
    />
  );
};

export default ResultsSort;
