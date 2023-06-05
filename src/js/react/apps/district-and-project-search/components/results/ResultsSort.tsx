import { Select } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect , useState } from 'react';

import { urlAtom, urlUpdateAtom } from '../../store';
import sortOptions from '../../enum/SortOptions';
import type OptionType from '../../types/OptionType';

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
        label={Drupal.t('Sort search results', {}, { context: 'District and project search form label' })}
        options={sortOptions}
        onChange={(option: OptionType) => {
          setSort(option);
          setUrlParams({
            ...urlParams,
            sort: option.value,
          });
        }}
        value={sort}
        style={{ minWidth: '280px' }}
      />
    </div>

  );
};

export default ResultsSort;
