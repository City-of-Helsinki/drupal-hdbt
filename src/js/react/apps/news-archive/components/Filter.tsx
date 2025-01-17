import { Select } from 'hds-react';
import { useAtom } from 'jotai';
import { useState } from 'react';

import OptionType from '@/types/OptionType';
import { stagedParamsAtom } from '../store';
import URLParams from '../types/URLParams';

type FilterProps = {
  label: string;
  options: OptionType[];
  placeholder: string;
  stateKey: keyof URLParams;
};

const Filter = ({label, options, stateKey, ...rest}: FilterProps) =>  {
  const [params, setParams] = useAtom(stagedParamsAtom);
  const [filterSelectOpen, setFilterSelectOpen] = useState(false);
  const valueIds = params?.[stateKey] || [];

  const getValue = () => {
    const values: OptionType[] = [];

    if (Array.isArray(valueIds)) {
      valueIds.forEach((id: number) => {
        const option = options.find((valueOption: OptionType) => id.toString() === valueOption.value);

        if (option) {
          values.push(option);
        }
      });
    }

    return values;
  };

  const onChange = (selectedOptions: OptionType[], clickedOption?: OptionType) => {
    setParams({
      ...params,
      [stateKey]: selectedOptions.map((option: OptionType) => Number(option.value)),
    });

    // Keep dropdown open if an option is clicked
    if (clickedOption) {
      setFilterSelectOpen(true);
    }
  };

  return (
    /* @ts-ignore */
    <Select
      clearable
      multiSelect
      noTags
      onBlur={() => setFilterSelectOpen(false)}
      onChange={onChange}
      open={filterSelectOpen}
      options={options}
      texts={{
        clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': label}, { context: 'React search clear selection label' }),
        clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': label}, { context: 'React search clear selection label' }),
        label,
      }}
      value={getValue()}
      {...rest}
    />
  );
};

export default Filter;
