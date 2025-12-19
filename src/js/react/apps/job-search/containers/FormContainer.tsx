import { Button, Checkbox, Select, TextInput } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type React from 'react';
import { useEffect } from 'react';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import { defaultMultiSelectTheme, defaultSelectTheme } from '@/react/common/constants/selectTheme';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import bucketToMap from '@/react/common/helpers/Aggregations';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import CustomIds from '../enum/CustomTermIds';
import SearchComponents from '../enum/SearchComponents';
import { getInitialLanguage } from '../helpers/Language';
import transformDropdownsValues, { paramsFromSelections } from '../helpers/Params';
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
  monitorSubmittedAtom,
  summerJobsAtom,
  taskAreasAtom,
  taskAreasSelectionAtom,
  urlAtom,
  urlUpdateAtom,
  youthSummerJobsAtom,
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
  const taskAreasOptions = useAtomValue(taskAreasAtom);
  const employmentOptions = useAtomValue(employmentAtom);
  const [employmentSelection, setEmploymentFilter] = useAtom(employmentSelectionAtom);
  const languagesOptions = useAtomValue(languagesAtom);
  const [languageSelection, setLanguageFilter] = useAtom(languageSelectionAtom);
  const { employmentSearchIds } = useAtomValue(configurationsAtom);
  const employmentSearchIdMap = bucketToMap(employmentSearchIds);
  const areaFilterOptions = useAtomValue(areaFilterAtom);
  const [areaFilterSelection, setAreaFilter] = useAtom(areaFilterSelectionAtom);
  const setSubmitted = useSetAtom(monitorSubmittedAtom);

  // Set form control values from url parameters on load
  // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12501
  useEffect(() => {
    setKeyword(urlParams?.keyword?.toString() || '');
    setAreaFilter(transformDropdownsValues(urlParams?.area_filter, areaFilterOptions));
    setTaskAreaFilter(transformDropdownsValues(urlParams?.task_areas, taskAreasOptions));
    setEmploymentFilter(transformDropdownsValues(urlParams?.employment, employmentOptions));
    setContinuous(!!urlParams?.continuous);
    setInternship(!!urlParams?.internship);
    setSummerJobs(!!urlParams?.summer_jobs);
    setYouthSummerJobs(!!urlParams?.youth_summer_jobs);
    const initialLanguage: OptionType | undefined = getInitialLanguage(urlParams?.language, languagesOptions);

    if (initialLanguage) {
      setLanguageFilter([initialLanguage]);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selections = {
      area_filter: areaFilterSelection.map((selection: OptionType) => selection.value),
      employment: employmentSelection.reduce(
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
        (acc: any, curr: any) => acc.concat(curr.value),
        [],
      ),
      keyword,
      language: languageSelection?.[0]?.value || undefined,
      continuous,
      internship,
      task_areas: taskAreaSelection.map((selection: OptionType) => selection.value),
      summer_jobs: summerJobs,
      youth_summer_jobs: youthSummerJobs,
    };

    if (formAction.length) {
      const newUrl = new URL(formAction, window.location.origin);
      newUrl.search = paramsFromSelections(selections);
      window.location.href = newUrl.toString();
      return;
    }

    setUrlParams({
      area_filter: areaFilterSelection.map((selection: OptionType) => selection.value),
      employment: employmentSelection.reduce(
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
        (acc: any, curr: any) => acc.concat(curr.value),
        [],
      ),
      keyword,
      language: languageSelection?.[0]?.value || undefined,
      continuous,
      internship,
      task_areas: taskAreaSelection.map((selection: OptionType) => selection.value),
      summer_jobs: summerJobs,
      youth_summer_jobs: youthSummerJobs,
    });
    setSubmitted(false);
  };

  const handleKeywordChange = ({ target: { value } }: { target: { value: string } }) =>
    setKeyword(value.replace(/\s+/g, ' '));

  const isFullSearch = !drupalSettings?.helfi_rekry_job_search?.results_page_path;

  const showContinuous = employmentSearchIdMap.get(CustomIds.CONTINUOUS);
  const showInternships = employmentSearchIdMap.get(CustomIds.TRAINING);
  const showSummerJobs = employmentSearchIdMap.get(CustomIds.SUMMER_JOBS);
  const showYouthSummerJobs =
    employmentSearchIdMap.get(CustomIds.YOUTH_SUMMER_JOBS) || employmentSearchIdMap.get(CustomIds.COOL_SUMMER_PROJECT);
  const showCheckboxes = showContinuous || showInternships || showSummerJobs || showYouthSummerJobs;

  const areaFilterLabel: string = Drupal.t('Job location', {}, { context: 'Job search: Job location label' });
  const taskAreasLabel: string = Drupal.t('Task area', {}, { context: 'Task areas filter label' });
  const employmentRelationshipLabel: string = Drupal.t('Employment type', {}, { context: 'Employment filter label' });
  const languageLabel: string = Drupal.t('Language', {}, { context: 'Language filter label' });
  const currentLanguage = getCurrentLanguage(window.drupalSettings.path.currentLanguage);

  return (
    // biome-ignore lint/a11y/useSemanticElements: @todo UHF-12501
    <form className='job-search-form' role='search' onSubmit={handleSubmit} action={formAction}>
      <TextInput
        className='job-search-form__filter'
        id={SearchComponents.KEYWORD}
        label={Drupal.t('Search term', {}, { context: 'Search keyword label' })}
        name={SearchComponents.KEYWORD}
        onChange={handleKeywordChange}
        placeholder={Drupal.t(
          'E.g. psychologist or sports services',
          {},
          { context: 'HELfi Rekry job search keyword placeholder' },
        )}
        helperText={Drupal.t(
          'Enter a title or location, for example',
          {},
          { context: 'HELfi Rekry job search keyword input helper' },
        )}
        type='search'
        value={keyword}
        clearButtonAriaLabel={Drupal.t('Clear', {}, { context: 'React search' })}
        style={defaultTextInputStyle}
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
              onChange={(selectedOptions) => {
                setTaskAreaFilter(selectedOptions);
              }}
              options={taskAreasOptions}
              texts={{
                clearButtonAriaLabel_one: Drupal.t(
                  'Clear @label selection',
                  { '@label': taskAreasLabel },
                  { context: 'React search clear selection label' },
                ),
                clearButtonAriaLabel_multiple: Drupal.t(
                  'Clear @label selection',
                  { '@label': taskAreasLabel },
                  { context: 'React search clear selection label' },
                ),
                label: taskAreasLabel,
                language: currentLanguage,
                placeholder: Drupal.t('All fields', {}, { context: 'Task areas filter placeholder' }),
              }}
              value={taskAreaSelection}
              theme={defaultMultiSelectTheme}
            />
          </div>
          <div className='job-search-form__filter job-search-form__dropdown--upper'>
            <Select
              className='job-search-form__dropdown'
              clearable
              id={SearchComponents.EMPLOYMENT_RELATIONSHIP}
              multiSelect
              noTags
              onChange={(selectedOptions) => setEmploymentFilter(selectedOptions)}
              options={employmentOptions}
              texts={{
                clearButtonAriaLabel_one: Drupal.t(
                  'Clear @label selection',
                  { '@label': employmentRelationshipLabel },
                  { context: 'React search clear selection label' },
                ),
                clearButtonAriaLabel_multiple: Drupal.t(
                  'Clear @label selection',
                  { '@label': employmentRelationshipLabel },
                  { context: 'React search clear selection label' },
                ),
                label: employmentRelationshipLabel,
                language: currentLanguage,
                placeholder: Drupal.t('All employment types', {}, { context: 'Employment filter placeholder' }),
              }}
              value={employmentSelection}
              theme={defaultMultiSelectTheme}
            />
          </div>
        </div>
      </div>
      {isFullSearch && (
        <div className='job-search-form__dropdowns'>
          <div className='job-search-form__dropdowns__upper'>
            <div className='job-search-form__filter job-search-form__dropdown--upper'>
              <Select
                className='job-search-form__dropdown'
                clearable
                id={SearchComponents.LANGUAGE}
                noTags
                onChange={(selectedOptions) => {
                  setLanguageFilter(selectedOptions);
                }}
                options={languagesOptions}
                texts={{
                  clearButtonAriaLabel_one: Drupal.t(
                    'Clear @label selection',
                    { '@label': languageLabel },
                    { context: 'React search clear selection label' },
                  ),
                  clearButtonAriaLabel_multiple: Drupal.t(
                    'Clear @label selection',
                    { '@label': languageLabel },
                    { context: 'React search clear selection label' },
                  ),
                  label: languageLabel,
                  language: currentLanguage,
                  placeholder: Drupal.t('All languages', {}, { context: 'Language placeholder' }),
                }}
                value={languageSelection}
                theme={defaultSelectTheme}
              />
            </div>
            <div className='job-search-form__filter job-search-form__dropdown--upper'>
              <Select
                className='job-search-form__dropdown'
                clearable
                id={SearchComponents.AREA_FILTER}
                multiSelect
                noTags
                onChange={(selectedOptions) => {
                  setAreaFilter(selectedOptions);
                }}
                options={areaFilterOptions}
                value={areaFilterSelection}
                texts={{
                  clearButtonAriaLabel_one: Drupal.t(
                    'Clear @label selection',
                    { '@label': areaFilterLabel },
                    { context: 'React search clear selection label' },
                  ),
                  clearButtonAriaLabel_multiple: Drupal.t(
                    'Clear @label selection',
                    { '@label': areaFilterLabel },
                    { context: 'React search clear selection label' },
                  ),
                  label: areaFilterLabel,
                  language: currentLanguage,
                  placeholder: Drupal.t('All areas', {}, { context: 'Location placeholder' }),
                }}
                theme={defaultMultiSelectTheme}
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
              style={defaultCheckboxStyle}
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
              style={defaultCheckboxStyle}
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
              style={defaultCheckboxStyle}
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
              style={defaultCheckboxStyle}
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
