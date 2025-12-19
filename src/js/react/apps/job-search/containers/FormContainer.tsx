import { Button } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import type React from 'react';
import CustomIds from '../enum/CustomTermIds';
import {
  getEmploymentSearchIdMap,
  searchStateAtom,
  submitStateAtom,
} from '../store';
import SelectionsContainer from './SelectionsContainer';
import { SearchBar } from '../components/SearchBar';
import { TaskAreaFilter } from '../components/TaskAreaFilter';
import { EmploymentFilter } from '../components/EmploymentFilter';
import { LanguageFilter } from '../components/LanguageFilter';
import { AreaFilter } from '../components/AreaFilter';
import { CheckBoxFilters } from '../components/CheckBoxFilters';
import { paramsFromSelections } from '../helpers/Params';
import { useCallback } from 'react';
import { useAtomCallback } from 'jotai/utils';
import { stateToURLParams } from '@/react/common/helpers/StateToURLParams';

const FormContainer = () => {
  const employmentSearchIdMap = useAtomValue(getEmploymentSearchIdMap);
  const submitState = useSetAtom(submitStateAtom);
  const readState = useAtomCallback(
    useCallback((get) => get(searchStateAtom), []),
  );
  const formAction =
    drupalSettings?.helfi_rekry_job_search?.results_page_path || '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (formAction.length) {
      const newUrl = new URL(formAction, window.location.origin);
      newUrl.search = stateToURLParams(readState()).toString();
      window.location.href = newUrl.toString();
      return;
    }

    submitState();
  };

  const isFullSearch =
    !drupalSettings?.helfi_rekry_job_search?.results_page_path;

  const checkBoxKeys = [
    CustomIds.CONTINUOUS,
    CustomIds.TRAINING,
    CustomIds.SUMMER_JOBS,
    CustomIds.YOUTH_SUMMER_JOBS,
  ];
  const showCheckboxes = checkBoxKeys.some((key) =>
    employmentSearchIdMap.get(key),
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: @todo UHF-12501
    <form
      className='job-search-form'
      role='search'
      onSubmit={handleSubmit}
      action={formAction}
    >
      <SearchBar />
      <div className='job-search-form__dropdowns'>
        <div className='job-search-form__dropdowns__upper'>
          <div className='job-search-form__filter job-search-form__dropdown--upper'>
            <TaskAreaFilter />
          </div>
          <div className='job-search-form__filter job-search-form__dropdown--upper'>
            <EmploymentFilter />
          </div>
        </div>
      </div>
      {isFullSearch && (
        <div className='job-search-form__dropdowns'>
          <div className='job-search-form__dropdowns__upper'>
            <div className='job-search-form__filter job-search-form__dropdown--upper'>
              <LanguageFilter />
            </div>
            <div className='job-search-form__filter job-search-form__dropdown--upper'>
              <AreaFilter />
            </div>
          </div>
        </div>
      )}
      {isFullSearch && showCheckboxes && <CheckBoxFilters />}
      <Button
        className='hdbt-search--react__submit-button job-search-form__submit-button'
        type='submit'
      >
        {Drupal.t(
          'Search',
          {},
          { context: 'React search: submit button label' },
        )}
      </Button>
      <SelectionsContainer />
    </form>
  );
};

export default FormContainer;
