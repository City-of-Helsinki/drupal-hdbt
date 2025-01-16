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
        onChange={(_selectedOptions, clickedOption) => {
          setSort(clickedOption);
          setUrlParams({
            ...urlParams,
            sort: clickedOption.value, // @todo Check that this works correctly
          });
        }}
        options={sortOptions}
        style={{ minWidth: '280px' }}
        texts={{
          label: Drupal.t('Sort search results', {}, { context: 'District and project search form label' }),
        }}
        value={[sort]}
      />
    </div>
  );
};

export default ResultsSort;
