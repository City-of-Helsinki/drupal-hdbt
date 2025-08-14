import { Select } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect , useState } from 'react';

import { urlAtom, urlUpdateAtom } from '../../store';
import sortOptions from '../../enum/SortOptions';
import type OptionType from '../../types/OptionType';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import { defaultSelectTheme } from '@/react/common/constants/selectTheme';

const ResultsSort = () => {
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);
  const [sort, setSort] = useState<OptionType>(sortOptions[0]);

  useEffect(() => {
    if (urlParams.sort) {
      const matchedSort = sortOptions.find((option: OptionType) => option.value === urlParams.sort);

      if (matchedSort) {
        setSort(matchedSort);
      }
    }
  }, []);

  return (
    <div className="district-project-search-form__filter hdbt-search__filter">
      <Select
        clearable={false}
        onChange={(_selectedOptions, clickedOption) => {
          setSort(clickedOption);
          setUrlParams({
            ...urlParams,
            sort: clickedOption.value,
          });
        }}
        options={sortOptions}
        theme={defaultSelectTheme}
        style={{ minWidth: '280px' }}
        texts={{
          label: Drupal.t('Sort search results', {}, { context: 'District and project search form label' }),
          language: getCurrentLanguage(window.drupalSettings.path.currentLanguage)
        }}
        value={[sort]}
      />
    </div>
  );
};

export default ResultsSort;
