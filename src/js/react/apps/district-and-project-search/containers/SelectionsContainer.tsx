import { Button, IconCross } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';

import FilterButton from '@/react/common/FilterButton';
import SearchComponents from '../enum/SearchComponents';
import transformDropdownsValues from '../helpers/Params';
import { capitalize } from '../helpers/helpers';
import {
  urlAtom,
  urlUpdateAtom,
  districtsAtom,
  districtSelectionAtom,
  themesAtom,
  themeSelectionAtom,
  phasesAtom,
  phaseSelectionAtom,
  typesAtom,
  typeSelectionAtom,
  resetFormAtom
} from '../store';
import OptionType from '../types/OptionType';

const SelectionsContainer = () => {
  const urlParams = useAtomValue(urlAtom);
  const resetForm = useSetAtom(resetFormAtom);
  const districtOptions = useAtomValue(districtsAtom);
  const updateDistricts = useSetAtom(districtSelectionAtom);
  const themeOptions = useAtomValue(themesAtom);
  const updateThemes = useSetAtom(themeSelectionAtom);
  const phaseOptions = useAtomValue(phasesAtom);
  const updatePhases = useSetAtom(phaseSelectionAtom);
  const typeOptions = useAtomValue(typesAtom);
  const updateTypes = useSetAtom(typeSelectionAtom);

  const showClearButton =
    urlParams?.districts?.length ||
    urlParams?.project_theme?.length ||
    urlParams?.project_phase?.length ||
    urlParams?.project_type?.length;

  const showDistricts = Boolean(urlParams.districts?.length);
  const showProjectThemes = Boolean(urlParams.project_theme?.length);
  const showProjectPhases = Boolean(urlParams.project_phase?.length);
  const showProjectTypes = Boolean(urlParams.project_type?.length);

  return (
    <div className='hdbt-search__selections-wrapper'>
      <ul className='hdbt-search__selections-container content-tags__tags'>
        {showDistricts && (
          <ListFilter
            updater={updateDistricts}
            valueKey={SearchComponents.DISTRICTS}
            values={transformDropdownsValues(urlParams.districts, districtOptions)}
          />
        )}
        {showProjectThemes && (
          <ListFilter
            updater={updateThemes}
            valueKey={SearchComponents.THEME}
            values={transformDropdownsValues(urlParams.project_theme, themeOptions)}
          />
        )}
        {showProjectPhases && (
          <ListFilter
            updater={updatePhases}
            valueKey={SearchComponents.PHASE}
            values={transformDropdownsValues(urlParams.project_phase, phaseOptions)}
          />
        )}
        {showProjectTypes && (
          <ListFilter
            updater={updateTypes}
            valueKey={SearchComponents.TYPE}
            values={transformDropdownsValues(urlParams.project_type, typeOptions)}
          />
        )}
        <li className='hdbt-search__clear-all'>
          <Button
            aria-hidden={showClearButton ? 'true' : 'false'}
            className='hdbt-search__clear-all-button'
            iconLeft={<IconCross className='hdbt-search__clear-all-icon' />}
            onClick={resetForm}
            style={showClearButton ? {} : { visibility: 'hidden' }}
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

type ListFilterProps = {
  updater: Function;
  valueKey: string;
  values: OptionType[];
};

const ListFilter = ({ updater, values, valueKey }: ListFilterProps) => {
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);

  const removeSelection = (value: string) => {
    const newValue = values;
    const index = newValue.findIndex((selection: OptionType) => selection.value === value);
    newValue.splice(index, 1);
    updater(newValue);
    setUrlParams({
      ...urlParams,
      [valueKey]: newValue.map((selection: OptionType) => selection.value),
    });
  };

  return (
    <>
      {values.map((selection: OptionType) => (
        <FilterButton
          value={capitalize(selection.value)}
          clearSelection={() => removeSelection(selection.value)}
          key={selection.value}
        />
      ))}
    </>
  );
};