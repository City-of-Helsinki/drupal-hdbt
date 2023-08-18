import { useAtomValue, useSetAtom } from 'jotai';
import { Button, IconCross } from 'hds-react';
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
    grades_1_6: Drupal.t('School providing grades 1 to 6', {}, {context: 'School search: education level option'}),
    grades_1_9: Drupal.t('School providing grades 1 to 9', {}, {context: 'School search: education level option'}),
    grades_7_9: Drupal.t('School providing grades 7 to 9', {}, {context: 'School search: education level option'}),
    finnish_education: Drupal.t('Finnish'),
    swedish_education: Drupal.t('Swedish'),
  };
  const checkBoxKeys = Object.keys(checkBoxFilters);

  const getPills = () => {
    const pills: JSX.Element[] = [];

    keys.forEach((key) => {
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

  const resetForm = () => {
    setSearchParams({});
  };

  const showClearButton =
    searchParams.finnish_education ||
    searchParams.swedish_education ||
    searchParams.grades_1_6 ||
    searchParams.grades_1_9 ||
    searchParams.grades_7_9;

  return (
    <div className='hdbt-search__selections-wrapper'>
      <ul className='hdbt-search__selections-container content-tags__tags'>
        {getPills()}
        <li className='hdbt-search__clear-all'>
          <Button
            aria-hidden={!showClearButton}
            className="hdbt-search__clear-all-button"
            iconLeft={<IconCross className='job-search-form__clear-all-icon' />}
            onClick={resetForm}
            style={showClearButton ? {} : { visibility: 'hidden'}}
            variant='supplementary'
          >
            {Drupal.t('Clear selections', {}, { context: 'React search: clear selections' })}
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default SelectionsContainer;
