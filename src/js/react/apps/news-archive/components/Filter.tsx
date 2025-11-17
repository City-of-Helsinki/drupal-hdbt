import { Select } from 'hds-react';
import { useAtom } from 'jotai';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import type OptionType from '@/types/OptionType';
import { stagedParamsAtom } from '../store';
import type URLParams from '../types/URLParams';

type FilterProps = {
  label: string;
  options: OptionType[];
  placeholder: string;
  stateKey: keyof URLParams;
};

const Filter = ({
  label,
  options,
  placeholder,
  stateKey,
  ...rest
}: FilterProps) => {
  const [params, setParams] = useAtom(stagedParamsAtom);
  const valueIds = params?.[stateKey] || [];

  const getValue = () => {
    const values: OptionType[] = [];

    if (Array.isArray(valueIds)) {
      valueIds.forEach((id: number) => {
        const option = options.find(
          (valueOption: OptionType) => id.toString() === valueOption.value,
        );

        if (option) {
          values.push(option);
        }
      });
    }

    return values;
  };

  const onChange = (
    selectedOptions: OptionType[],
    _clickedOption?: OptionType,
  ) => {
    setParams({
      ...params,
      [stateKey]: selectedOptions.map((option: OptionType) =>
        Number(option.value),
      ),
    });
  };

  return (
    <Select
      clearable
      multiSelect
      noTags
      onChange={onChange}
      options={options}
      texts={{
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': label },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': label },
          { context: 'React search clear selection label' },
        ),
        label,
        language: getCurrentLanguage(
          window.drupalSettings.path.currentLanguage,
        ),
        placeholder,
      }}
      theme={defaultMultiSelectTheme}
      value={getValue()}
      {...rest}
    />
  );
};

export default Filter;
