import { Button, IconCross } from 'hds-react';
import { SetStateAction, WritableAtom, useAtomValue, useSetAtom } from 'jotai';

import FilterButton from '@/react/common/FilterButton';
import SearchComponents from '../enum/SearchComponents';
import { getLanguageLabel } from '../helpers/Language';
import transformDropdownsValues from '../helpers/Params';
import {
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
import OptionType from '../types/OptionType';

const SelectionsContainer = () => {
  const urlParams = useAtomValue(urlAtom);
  const resetForm = useSetAtom(resetFormAtom);
  const taskAreaOptions = useAtomValue(taskAreasAtom);
  const updateTaskAreas = useSetAtom(taskAreasSelectionAtom);
  const employmentOptions = useAtomValue(employmentAtom);
  const updateEmploymentOptions = useSetAtom(employmentSelectionAtom);

  const showClearButton =
    urlParams?.task_areas?.length ||
    urlParams?.continuous ||
    urlParams?.internship ||
    urlParams?.language ||
    urlParams?.summer_jobs ||
    urlParams?.youth_summer_jobs ||
    urlParams.employment?.length;

  const showTaskAreas = Boolean(urlParams.task_areas?.length && urlParams.task_areas.length > 0);
  const showEmployment = Boolean(urlParams.employment?.length && urlParams.employment?.length > 0);

  return (
    <div className='job-search-form__selections-wrapper'>
      <ul className='job-search-form__selections-container content-tags__tags'>
        {showTaskAreas && (
          <ListFilter
            updater={updateTaskAreas}
            valueKey={SearchComponents.TASK_AREAS}
            values={transformDropdownsValues(urlParams.task_areas, taskAreaOptions)}
          />
        )}
        {showEmployment && (
          <ListFilter
            updater={updateEmploymentOptions}
            valueKey={SearchComponents.EMPLOYMENT}
            values={transformDropdownsValues(urlParams.employment, employmentOptions)}
          />
        )}
        {urlParams.language && (
          <SingleFilter
            label={getLanguageLabel(urlParams.language)}
            atom={languageSelectionAtom}
            valueKey={SearchComponents.LANGUAGE}
          />
        )}
        {urlParams.continuous && (
          <CheckboxFilterPill
            label={Drupal.t('Open-ended vacancies', {}, { context: 'Job search' })}
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
            label={Drupal.t('Summer jobs for young people', {}, { context: 'Job search' })}
            atom={youthSummerJobsAtom}
            valueKey={SearchComponents.YOUTH_SUMMER_JOBS}
          />
        )}
        <li className='job-search-form__clear-all'>
          <Button
            aria-hidden={showClearButton ? 'true' : 'false'}
            className='job-search-form__clear-all-button'
            iconLeft={<IconCross className='job-search-form__clear-all-icon' />}
            onClick={resetForm}
            style={showClearButton ? {} : { visibility: 'hidden' }}
            variant='supplementary'
          >
            {Drupal.t('Clear selections', {}, { context: 'Job search clear selections' })}
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
          value={selection.simpleLabel || selection.label}
          clearSelection={() => removeSelection(selection.value)}
          key={selection.value}
        />
      ))}
    </>
  );
};

type CheckboxFilterPillProps = {
  atom: any;
  valueKey: string;
  label: string;
};

const CheckboxFilterPill = ({ atom, valueKey, label }: CheckboxFilterPillProps) => {
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
  atom: any;
  valueKey: string;
  label: string;
};
const SingleFilter = ({ atom, valueKey, label }: SingleFilterProps) => {
  const setValue = useSetAtom(atom);
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);

  const { language, ...updatedParams } = urlParams;

  return (
    <FilterButton
      value={label}
      clearSelection={() => {
        setUrlParams(updatedParams);
        setValue(null);
      }}
    />
  );
};
