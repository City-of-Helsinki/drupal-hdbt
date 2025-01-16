import { Select } from 'hds-react';
import { useAtom } from 'jotai';

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
  const valueIds = params?.[stateKey] || [];

  const onChange = (value: any) => {
    setParams({
      ...params,
      [stateKey]: value.map((option: OptionType) => Number(option.value))
    });
  };

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

  return (
    /* @ts-ignore */
    <Select
      clearable
      multiSelect
      onChange={onChange}
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
