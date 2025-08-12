import { Select } from 'hds-react';
import { useAtom } from 'jotai';

import OptionType from '@/types/OptionType';
import { stagedParamsAtom } from '../store';
import URLParams from '../types/URLParams';
import {getCurrentLanguage} from '@/react/common/helpers/GetCurrentLanguage';

type FilterProps = {
  label: string;
  options: OptionType[];
  placeholder: string;
  stateKey: keyof URLParams;
};

const Filter = ({label, options, placeholder, stateKey, ...rest}: FilterProps) =>  {
  const [params, setParams] = useAtom(stagedParamsAtom);
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
  };

  return (
    /* @ts-ignore */
    <Select
      clearable
      multiSelect
      noTags
      onChange={onChange}
      options={options}
      texts={{
        clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': label}, { context: 'React search clear selection label' }),
        clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': label}, { context: 'React search clear selection label' }),
        label,
        language: getCurrentLanguage(window.drupalSettings.path.currentLanguage),
        placeholder,
      }}
      theme={{
        '--checkbox-background-selected': 'var(--hdbt-color-black)',
        '--checkbox-background-hover': 'var(--hdbt-color-black)',
        '--checkbox-border-color-selected': 'var(--hdbt-color-black)',
        '--checkbox-border-color-selected-hover': 'var(--hdbt-color-black)',
        '--checkbox-border-color-selected-focus': 'var(--hdbt-color-black)',
        '--focus-outline-color': 'var(--hdbt-color-black)',
        '--menu-item-border-color-focus': 'var(--hdbt-color-black)',
        '--menu-item-background-color-hover': 'var(--color-black-5)',
        '--menu-item-background-color-selected': 'var(--color-white)',
        '--menu-item-background-color-selected-hover': 'var(--color-black-5)'
      }}
      value={getValue()}
      {...rest}
    />
  );
};

export default Filter;
