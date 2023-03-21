import { useAtomValue, useSetAtom } from 'jotai';
import { paramsAtom, updateParamsAtom } from '../store';
import SearchParams from '../types/SearchParams';
import FilterButton from '@/react/common/FilterButton';

type SelectionsContainerProps = {
  keys: Array<keyof Omit<SearchParams,'keyword'|'page'|'query'>>
};

const SelectionsContainer = ({ keys }: SelectionsContainerProps) => {
  const searchParams = useAtomValue(paramsAtom);
  const setSearchParams = useSetAtom(updateParamsAtom);

  const checkBoxFilters = {
    grades_1_6: Drupal.t('Lower levels (1-6)'),
    grades_7_9: Drupal.t('Upper levels (7-9)'),
    finnish_education: Drupal.t('Finnish'),
    swedish_education: Drupal.t('Swedish'),
  };
  const checkBoxKeys = Object.keys(checkBoxFilters);

  const getPills = () => {
    const pills: JSX.Element[] = [];

    keys.forEach((key ) => {
      if (!checkBoxKeys.includes(key) || !searchParams[key]) {
        return;
      }
      
      pills.push(
        <FilterButton
          key={key}
          value={checkBoxFilters[key]}
          clearSelection={() => {
            const newParams = {...searchParams};
            newParams[key] = false;
            setSearchParams(newParams);
          }}
        />
      );
    });

    return pills;
  };

  return (
    <div className='hdbt-search__selections-wrapper'>
      <ul className='hdbt-search__selections-container content-tags__tags'>
        {getPills()}
      </ul>
    </div>
  );
};

export default SelectionsContainer;
