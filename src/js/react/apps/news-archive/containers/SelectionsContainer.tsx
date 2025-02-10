import { useAtomValue, useSetAtom } from 'jotai';

import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import FilterButton from '@/react/common/FilterButton';
import { urlAtom, urlUpdateAtom } from '../store';
import OptionType from '@/types/OptionType';
import URLParams from '../types/URLParams';

type SelectionsContainerProps = {
  topic?: OptionType[];
  neighbourhoods?: OptionType[];
  groups?: OptionType[];
};

type ParamsKey = keyof Omit<URLParams, 'page'>;

const SelectionsContainer = ({
  topic,
  neighbourhoods,
  groups
}: SelectionsContainerProps) => {
  const params = useAtomValue(urlAtom);
  const updateParams = useSetAtom(urlUpdateAtom);

  const generatePill = (option: OptionType, key: ParamsKey) => (
    <FilterButton
      key={option.value}
      value={option?.label || option.value}
      clearSelection={() => {
        const newParams = {...params, page: 1};
        const index = newParams?.[key]?.indexOf(Number(option.value));

        if (typeof index !== 'undefined' && !Number.isNaN(index) && index !== -1) {
          newParams[key]?.splice(index, 1);
          updateParams({...newParams});
        }
      }}
    />
  );

  const getPills = () => {
    const pills: JSX.Element[] = [];

    const keys: ParamsKey[] = ['topic', 'neighbourhoods', 'groups'];
    const passedOptions = {
      topic,
      neighbourhoods,
      groups
    };
    [params.topic, params.neighbourhoods, params.groups].forEach((selections, index) => {
      if (selections?.length) {
        selections.forEach(id => {
          const option  = passedOptions[keys[index]]?.find((valueOption: OptionType) => id === Number(valueOption.value));

          if (!option) {
            return;
          }

          const paramKey = keys[index];
          pills.push(generatePill(option, paramKey));
        });
      }
    });

    return pills;
  };

  const clearSelections = () => {
    updateParams({
      page: 1
    });
  };

  const showClearButton = params.topic?.length || params.neighbourhoods?.length || params.groups?.length;

  return (
    <SelectionsWrapper showClearButton={showClearButton} resetForm={clearSelections}>
      {getPills()}
    </SelectionsWrapper>
  );
};

export default SelectionsContainer;
