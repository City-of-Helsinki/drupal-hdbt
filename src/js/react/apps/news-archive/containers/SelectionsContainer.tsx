import { useAtomValue, useSetAtom } from 'jotai';
import { Button, IconCross } from 'hds-react';
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

        if (typeof index !== 'undefined' && !Number.isNaN(index) && newParams?.[key]?.length) {
          newParams[key]?.splice(0, 1);
          updateParams(newParams);
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

  const selectionsExist = params.topic?.length || params.neighbourhoods?.length || params.groups?.length;

  return (
    <div className='news-form__selections-wrapper'>
      <ul className='news-form__selections-container content-tags__tags'>
        {getPills()}
        <li className='news-form__clear-all'>
          <Button
            aria-hidden={selectionsExist ? 'false' : 'true'}
            className='news-form__clear-all-button'
            iconLeft={<IconCross className='news-form__clear-all-icon' />}
            onClick={clearSelections}
            style={selectionsExist ? {} : { visibility: 'hidden' }}
            variant='supplementary'
          >
            {Drupal.t('Clear selections', {}, { context: 'News archive clear selections' })}
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default SelectionsContainer;
