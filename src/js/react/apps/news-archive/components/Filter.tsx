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

const Filter = ({stateKey, options, ...rest}: FilterProps) =>  {
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
    };

    return values;
  };

  return (
    <Select
      className='news-form__filter'
      clearable
      clearButtonAriaLabel={Drupal.t('Clear selection')}
      onChange={onChange}
      multiselect
      selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item')}
      /* @ts-ignore */
      options={options}
      value={getValue()}
      {...rest}
    />
  );
};

export default Filter;
