import { useAtomValue, useSetAtom } from 'jotai';
import FilterButton from '@/react/common/FilterButton';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import SearchComponents from '../enum/SearchComponents';
import { getLanguageLabel } from '../helpers/Language';
import transformDropdownsValues from '../helpers/Params';
import {
  areaFilterAtom,
  areaFilterSelectionAtom,
  continuousAtom,
  employmentAtom,
  employmentSelectionAtom,
  internshipAtom,
  languageSelectionAtom,
  resetFormAtom,
  summerJobsAtom,
  taskAreasAtom,
  taskAreasSelectionAtom,
  urlAtom,
  urlUpdateAtom,
  youthSummerJobsAtom,
} from '../store';
import type OptionType from '../types/OptionType';

const SelectionsContainer = () => {
  const urlParams = useAtomValue(urlAtom);
  const resetForm = useSetAtom(resetFormAtom);
  const taskAreaOptions = useAtomValue(taskAreasAtom);
  const updateTaskAreas = useSetAtom(taskAreasSelectionAtom);
  const employmentOptions = useAtomValue(employmentAtom);
  const updateEmploymentOptions = useSetAtom(employmentSelectionAtom);
  const updateAreaFilter = useSetAtom(areaFilterSelectionAtom);
  const areaFilterOptions = useAtomValue(areaFilterAtom);

  const showClearButton =
    urlParams?.area_filter?.length ||
    urlParams?.task_areas?.length ||
    urlParams?.continuous ||
    urlParams?.internship ||
    urlParams?.language ||
    urlParams?.summer_jobs ||
    urlParams?.youth_summer_jobs ||
    urlParams?.employment?.length;

  const showTaskAreas = Boolean(
    urlParams.task_areas?.length && urlParams.task_areas.length > 0,
  );
  const showEmployment = Boolean(
    urlParams.employment?.length && urlParams.employment?.length > 0,
  );

  return (
    <SelectionsWrapper showClearButton={showClearButton} resetForm={resetForm}>
      {showTaskAreas && (
        <ListFilter
          updater={updateTaskAreas}
          valueKey={SearchComponents.TASK_AREAS}
          values={transformDropdownsValues(
            urlParams.task_areas,
            taskAreaOptions,
          )}
        />
      )}
      {showEmployment && (
        <ListFilter
          updater={updateEmploymentOptions}
          valueKey={SearchComponents.EMPLOYMENT}
          values={transformDropdownsValues(
            urlParams.employment,
            employmentOptions,
          )}
        />
      )}
      {urlParams.language && (
        <SingleFilter
          label={getLanguageLabel(urlParams.language)}
          atom={languageSelectionAtom}
          valueKey={SearchComponents.LANGUAGE}
        />
      )}
      {urlParams.area_filter && (
        <ListFilter
          updater={updateAreaFilter}
          valueKey={SearchComponents.AREA_FILTER}
          values={transformDropdownsValues(
            urlParams.area_filter,
            areaFilterOptions,
          )}
        />
      )}
      {urlParams.continuous && (
        <CheckboxFilterPill
          label={Drupal.t(
            'Open-ended vacancies',
            {},
            { context: 'Job search' },
          )}
          atom={continuousAtom}
          valueKey={SearchComponents.CONTINUOUS}
        />
      )}
      {urlParams.internship && (
        <CheckboxFilterPill
          label={Drupal.t('Practical training', {}, { context: 'Job search' })}
          atom={internshipAtom}
          valueKey={SearchComponents.INTERNSHIPS}
        />
      )}
      {urlParams.summer_jobs && (
        <CheckboxFilterPill
          label={Drupal.t('Summer jobs', {}, { context: 'Job search' })}
          atom={summerJobsAtom}
          valueKey={SearchComponents.SUMMER_JOBS}
        />
      )}
      {urlParams.youth_summer_jobs && (
        <CheckboxFilterPill
          label={Drupal.t(
            'Summer jobs for young people',
            {},
            { context: 'Job search' },
          )}
          atom={youthSummerJobsAtom}
          valueKey={SearchComponents.YOUTH_SUMMER_JOBS}
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
      [valueKey]: newValue.flatMap((selection: OptionType) => selection.value),
    });
  };

  return (
    <>
      {values.map((selection: OptionType) => (
        <FilterButton
          value={selection.simpleLabel || selection.label}
          clearSelection={() => removeSelection(selection.value)}
          key={selection.value}
        />
      ))}
    </>
  );
};

type CheckboxFilterPillProps = {
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
  atom: any;
  valueKey: string;
  label: string;
};

const CheckboxFilterPill = ({
  atom,
  valueKey,
  label,
}: CheckboxFilterPillProps) => {
  const setValue = useSetAtom(atom);
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);

  return (
    <FilterButton
      value={label}
      clearSelection={() => {
        setUrlParams({ ...urlParams, [valueKey]: false });
        setValue(false);
      }}
    />
  );
};

type SingleFilterProps = {
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
  atom: any;
  label: string;
  valueKey: string;
};
const SingleFilter = ({ atom, valueKey, label }: SingleFilterProps) => {
  const setValue = useSetAtom(atom);
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);

  return (
    <FilterButton
      value={label}
      clearSelection={() => {
        setUrlParams({ ...urlParams, [valueKey]: undefined });
        setValue(null);
      }}
    />
  );
};
