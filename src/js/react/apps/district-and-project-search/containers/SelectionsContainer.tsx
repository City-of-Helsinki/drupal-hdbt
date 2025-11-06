import { useAtomValue, useSetAtom } from 'jotai';

import FilterButton from '@/react/common/FilterButton';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import SearchComponents from '../enum/SearchComponents';
import { capitalize } from '../helpers/helpers';
import transformDropdownsValues from '../helpers/Params';
import {
  districtSelectionAtom,
  districtsAtom,
  phaseSelectionAtom,
  phasesAtom,
  resetFormAtom,
  themeSelectionAtom,
  themesAtom,
  typeSelectionAtom,
  typesAtom,
  urlAtom,
  urlUpdateAtom,
} from '../store';
import type OptionType from '../types/OptionType';

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
    <SelectionsWrapper showClearButton={showClearButton} resetForm={resetForm}>
      {showDistricts && (
        <ListFilter
          updater={updateDistricts}
          valueKey={SearchComponents.DISTRICTS}
          values={transformDropdownsValues(
            urlParams.districts,
            districtOptions,
          )}
        />
      )}
      {showProjectThemes && (
        <ListFilter
          updater={updateThemes}
          valueKey={SearchComponents.THEME}
          values={transformDropdownsValues(
            urlParams.project_theme,
            themeOptions,
          )}
        />
      )}
      {showProjectPhases && (
        <ListFilter
          updater={updatePhases}
          valueKey={SearchComponents.PHASE}
          values={transformDropdownsValues(
            urlParams.project_phase,
            phaseOptions,
          )}
        />
      )}
      {showProjectTypes && (
        <ListFilter
          updater={updateTypes}
          valueKey={SearchComponents.TYPE}
          values={transformDropdownsValues(urlParams.project_type, typeOptions)}
        />
      )}
    </SelectionsWrapper>
  );
};

export default SelectionsContainer;

type ListFilterProps = {
  // biome-ignore lint/complexity/noBannedTypes: @todo UHF-12066
  updater: Function;
  valueKey: string;
  values: OptionType[];
};

const ListFilter = ({ updater, values, valueKey }: ListFilterProps) => {
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);

  const removeSelection = (value: string) => {
    const newValue = values;
    const index = newValue.findIndex(
      (selection: OptionType) => selection.value === value,
    );
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
