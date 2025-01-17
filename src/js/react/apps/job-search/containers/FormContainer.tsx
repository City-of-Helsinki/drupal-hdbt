import { Button, Checkbox, Select, TextInput } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';

import bucketToMap from '@/react/common/helpers/Aggregations';
import CustomIds from '../enum/CustomTermIds';
import SearchComponents from '../enum/SearchComponents';
import { getInitialLanguage } from '../helpers/Language';
import transformDropdownsValues from '../helpers/Params';
import {
  areaFilterAtom,
  areaFilterSelectionAtom,
  configurationsAtom,
  continuousAtom,
  employmentAtom,
  employmentSelectionAtom,
  internshipAtom,
  keywordAtom,
  languageSelectionAtom,
  languagesAtom,
  summerJobsAtom,
  monitorSubmittedAtom,
  taskAreasAtom,
  taskAreasSelectionAtom,
  urlUpdateAtom,
  youthSummerJobsAtom,
  urlAtom
} from '../store';
import type OptionType from '../types/OptionType';
import SelectionsContainer from './SelectionsContainer';

const FormContainer = () => {
  const formAction = drupalSettings?.helfi_rekry_job_search?.results_page_path || '';
  const [continuous, setContinuous] = useAtom(continuousAtom);
  const [internship, setInternship] = useAtom(internshipAtom);
  const [summerJobs, setSummerJobs] = useAtom(summerJobsAtom);
  const [youthSummerJobs, setYouthSummerJobs] = useAtom(youthSummerJobsAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);
  const [taskAreaSelection, setTaskAreaFilter] = useAtom(taskAreasSelectionAtom);
  const [taskAreaSelectOpen, setTaskAreaSelectOpen] = useState(false);
  const taskAreasOptions = useAtomValue(taskAreasAtom);
  const employmentOptions = useAtomValue(employmentAtom);
  const [employmentSelection, setEmploymentFilter] = useAtom(employmentSelectionAtom);
  const [employmentSelectOpen, setEmploymentSelectOpen] = useState(false);
  const languagesOptions = useAtomValue(languagesAtom);
  const [languageSelection, setLanguageFilter] = useAtom(languageSelectionAtom);
  const { employmentSearchIds } = useAtomValue(configurationsAtom);
  const employmentSearchIdMap = bucketToMap(employmentSearchIds);
  const areaFilterOptions = useAtomValue(areaFilterAtom);
  const [areaFilterSelection, setAreaFilter] = useAtom(areaFilterSelectionAtom);
  const [areaFilterSelectOpen, setAreaFilterSelectOpen] = useState(false);
  const setSubmitted = useSetAtom(monitorSubmittedAtom);

  // Set form control values from url parameters on load
  useEffect(() => {
    setKeyword(urlParams?.keyword?.toString() || '');
    setAreaFilter(transformDropdownsValues(urlParams?.area_filter, areaFilterOptions));
    setTaskAreaFilter(transformDropdownsValues(urlParams?.task_areas, taskAreasOptions));
    setEmploymentFilter(transformDropdownsValues(urlParams?.employment, employmentOptions));
    setContinuous(!!urlParams?.continuous);
    setInternship(!!urlParams?.internship);
    setSummerJobs(!!urlParams?.summer_jobs);
    setYouthSummerJobs(!!urlParams?.youth_summer_jobs);
    setLanguageFilter(getInitialLanguage(urlParams?.language, languagesOptions));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (formAction.length) {
      return true;
    }

    event.preventDefault();
    setUrlParams({
      area_filter: areaFilterSelection.map((selection: OptionType) => selection.value),
      employment: employmentSelection.reduce((acc: any, curr: any) => {
        const target = curr.additionalValue
          ? [curr.additionalValue.toString(), curr.value.toString()]
          : [curr.value.toString()];
        return acc.concat(target);
      }, []),
      keyword,
      language: languageSelection?.value,
      continuous,
      internship,
      task_areas: taskAreaSelection.map((selection: OptionType) => selection.value),
      summer_jobs: summerJobs,
      youth_summer_jobs: youthSummerJobs,
    });
    setSubmitted(false);
  };

  const handleKeywordChange = ({ target: { value } }: { target: { value: string } }) => setKeyword(value.replace(/\s+/g, ' '));

  // Input values for native elements
  const taskAreaInputValue = taskAreaSelection.map((option: OptionType) => option.value);
  const employmentInputValue = employmentSelection.map((option: OptionType) => option.value);

  const isFullSearch = !drupalSettings?.helfi_rekry_job_search?.results_page_path;

  const showContinuous = employmentSearchIdMap.get(CustomIds.CONTINUOUS);
  const showInternships = employmentSearchIdMap.get(CustomIds.TRAINING);
  const showSummerJobs = employmentSearchIdMap.get(CustomIds.SUMMER_JOBS);
  const showYouthSummerJobs =
    employmentSearchIdMap.get(CustomIds.YOUTH_SUMMER_JOBS) || employmentSearchIdMap.get(CustomIds.COOL_SUMMER_PROJECT);
  const showCheckboxes = showContinuous || showInternships || showSummerJobs || showYouthSummerJobs;

  const areaFilterLabel: string = Drupal.t('Job location', {}, { context: 'Job search: Job location label' });
  const taskAreasLabel: string = Drupal.t('Task area', {}, { context: 'Task areas filter label' });
  const employmentRelationshipLabel: string = Drupal.t('Type of employment', {}, { context: 'Employment filter label' });
  const languageLabel: string = Drupal.t('Language', {}, { context: 'Language filter label' });

  return (
    <form className='job-search-form' role='search' onSubmit={handleSubmit} action={formAction}>
      <TextInput
        className='job-search-form__filter'
        id={SearchComponents.KEYWORD}
        label={Drupal.t('Search term', {}, { context: 'Search keyword label' })}
        name={SearchComponents.KEYWORD}
        onChange={handleKeywordChange}
        placeholder={Drupal.t('Eg. title, location, department', {}, { context: 'HELfi Rekry job search keyword placeholder' })}
        type='search'
        value={keyword}
      />
      <div className='job-search-form__dropdowns'>
        <div className='job-search-form__dropdowns__upper'>
          <div className='job-search-form__filter job-search-form__dropdown--upper'>
            <Select
              className='job-search-form__dropdown'
              clearable
              id={SearchComponents.TASK_AREAS}
              multiSelect
              noTags
              open={taskAreaSelectOpen}
              onBlur={() => setTaskAreaSelectOpen(false)}
              onChange={(selectedOptions, clickedOption) => {
                setTaskAreaFilter(selectedOptions);
                if (clickedOption) setTaskAreaSelectOpen(true);
              }}
              options={taskAreasOptions}
              texts={{
                clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': taskAreasLabel}, { context: 'React search clear selection label' }),
                clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': taskAreasLabel}, { context: 'React search clear selection label' }),
                label: taskAreasLabel,
                placeholder: Drupal.t('All fields', {}, { context: 'Task areas filter placeholder' }),
              }}
              value={taskAreaSelection}
            />
          </div>
          <div className='job-search-form__filter job-search-form__dropdown--upper'>
            <Select
              className='job-search-form__dropdown'
              id={SearchComponents.EMPLOYMENT_RELATIONSHIP}
              multiSelect
              noTags
              open={employmentSelectOpen}
              onChange={(selectedOptions, clickedOption) => {
                setEmploymentFilter(selectedOptions);
                if (clickedOption) setEmploymentSelectOpen(true);
              }}
              onBlur={() => setEmploymentSelectOpen(false)}
              options={employmentOptions}
              texts={{
                clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': employmentRelationshipLabel}, { context: 'React search clear selection label' }),
                clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': employmentRelationshipLabel}, { context: 'React search clear selection label' }),
                label: employmentRelationshipLabel,
                placeholder: Drupal.t('All types of employment', {}, { context: 'Employment filter placeholder' }),
              }}
              value={employmentSelection}
            />
          </div>
        </div>
        {/** Hidden select elements to enable native form functions */}
        {formAction && (
          <>
            <select
              aria-hidden
              multiple
              name={SearchComponents.TASK_AREAS}
              onChange={() => {}}
              style={{ display: 'none' }}
              value={taskAreaInputValue}
            >
              {taskAreaInputValue.map((value: string) => (
                <option aria-hidden key={value} value={value} />
              ))}
            </select>
            <select
              aria-hidden
              multiple
              name={SearchComponents.EMPLOYMENT}
              onChange={() => {}}
              style={{ display: 'none' }}
              value={employmentInputValue}
            >
              {employmentInputValue.map((value: string) => (
                <option aria-hidden key={value} value={value} />
              ))}
            </select>
          </>
        )}
      </div>
      {isFullSearch && (
        <div className='job-search-form__dropdowns'>
          <div className='job-search-form__dropdowns__upper'>
            <div className='job-search-form__filter job-search-form__dropdown--upper'>
              <Select
                className='job-search-form__dropdown'
                clearable
                id={SearchComponents.LANGUAGE}
                // @ts-ignore
                onChange={setLanguageFilter} // @todo Check that this works without @ts-ignore
                options={languagesOptions}
                texts={{
                  clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': languageLabel}, { context: 'React search clear selection label' }),
                  clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': languageLabel}, { context: 'React search clear selection label' }),
                  label: languageLabel,
                  placeholder: Drupal.t('All languages', {}, { context: 'Language placeholder' }),
                }}
                // @ts-ignore
                value={languageSelection} // @todo Check that this works without @ts-ignore
              />
            </div>
            <div className='job-search-form__filter job-search-form__dropdown--upper'>
              <Select
                className='job-search-form__dropdown'
                clearable
                id={SearchComponents.AREA_FILTER}
                multiSelect
                noTags
                open={areaFilterSelectOpen}
                onChange={(selectedOptions, clickedOption) => {
                  setAreaFilter(selectedOptions);
                  if (clickedOption) setAreaFilterSelectOpen(true);
                }}
                onBlur={() => setAreaFilterSelectOpen(false)}
                options={areaFilterOptions}
                value={areaFilterSelection}
                texts={{
                  clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': areaFilterLabel}, { context: 'React search clear selection label' }),
                  clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': areaFilterLabel}, { context: 'React search clear selection label' }),
                  label: areaFilterLabel,
                  placeholder: Drupal.t('All areas', {}, { context: 'Location placeholder' }),
                }}
              />
            </div>
          </div>
        </div>
      )}
      {isFullSearch && showCheckboxes && (
        <fieldset className='job-search-form__checkboxes'>
          <legend className='job-search-form__checkboxes-legend'>
            {Drupal.t('Filters', {}, { context: 'Checkbox filters heading' })}
          </legend>
          {showContinuous && (
            <Checkbox
              checked={continuous}
              className='job-search-form__checkbox'
              id={SearchComponents.CONTINUOUS}
              label={Drupal.t('Open-ended vacancies', {}, { context: 'Job search' })}
              name={SearchComponents.CONTINUOUS}
              onClick={() => setContinuous(!continuous)}
              value={continuous.toString()}
            />
          )}
          {showInternships && (
            <Checkbox
              checked={internship}
              className='job-search-form__checkbox'
              id={SearchComponents.INTERNSHIPS}
              label={Drupal.t('Practical training', {}, { context: 'Job search' })}
              name={SearchComponents.INTERNSHIPS}
              onClick={() => setInternship(!internship)}
              value={internship.toString()}
            />
          )}
          {showSummerJobs && (
            <Checkbox
              checked={summerJobs}
              className='job-search-form__checkbox'
              id={SearchComponents.SUMMER_JOBS}
              label={Drupal.t('Summer jobs', {}, { context: 'Job search' })}
              name={SearchComponents.SUMMER_JOBS}
              onClick={() => setSummerJobs(!summerJobs)}
              value={summerJobs.toString()}
            />
          )}
          {showYouthSummerJobs && (
            <Checkbox
              checked={youthSummerJobs}
              className='job-search-form__checkbox'
              id={SearchComponents.YOUTH_SUMMER_JOBS}
              label={Drupal.t('Summer jobs for young people', {}, { context: 'Job search' })}
              name={SearchComponents.YOUTH_SUMMER_JOBS}
              onClick={() => setYouthSummerJobs(!youthSummerJobs)}
              value={youthSummerJobs.toString()}
            />
          )}
        </fieldset>
      )}
      <Button className='hdbt-search--react__submit-button job-search-form__submit-button' type='submit'>
        {Drupal.t('Search', {}, { context: 'React search: submit button label' })}
      </Button>
      <SelectionsContainer />
    </form>
  );
};

export default FormContainer;
