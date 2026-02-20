import { useAtom, useSetAtom } from 'jotai';
import { sortAtom, visibleParams } from '../store';
import { sortOptions } from '../../enum/SortOptions';
import { type Option, Select } from 'hds-react';
import { updateParamsAtom, updateUrlAtom } from '../../../store';
import ApiKeys from '../../../enum/ApiKeys';

export const ResultsSort = () => {
  const [value, setValue] = useAtom(sortAtom);
  const updateParams = useSetAtom(updateParamsAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  const handleChange = (selectedOptions: Option[]) => {
    setValue(selectedOptions);
    updateParams({ [ApiKeys.SORT]: selectedOptions[0]?.value });
    updateUrl(visibleParams);
  };

  return (
    <Select
      className='hdbt-search--react__results--sort'
      options={sortOptions}
      texts={{
        label: Drupal.t('Sort search results', {}, { context: 'Cross-institutional studies: sort label' }),
      }}
      value={value}
      onChange={handleChange}
    />
  );
};
