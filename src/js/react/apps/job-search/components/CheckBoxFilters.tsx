import { useAtomValue, useSetAtom } from 'jotai';
import {
  getCheckBoxValuesAtom,
  getEmploymentSearchIdMap,
  setStateValueAtom,
} from '../store';
import CustomIds from '../enum/CustomTermIds';
import { Checkbox } from 'hds-react';
import SearchComponents from '../enum/SearchComponents';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';

export const CheckBoxFilters = () => {
  const [continuous, internship, summerJobs, youthSummerJobs] = useAtomValue(
    getCheckBoxValuesAtom,
  );
  const setStateValue = useSetAtom(setStateValueAtom);
  const employmentSearchIdMap = useAtomValue(getEmploymentSearchIdMap);
  const showContinuous = employmentSearchIdMap.get(CustomIds.CONTINUOUS);
  const showInternships = employmentSearchIdMap.get(CustomIds.TRAINING);
  const showSummerJobs = employmentSearchIdMap.get(CustomIds.SUMMER_JOBS);
  const showYouthSummerJobs =
    employmentSearchIdMap.get(CustomIds.YOUTH_SUMMER_JOBS) ||
    employmentSearchIdMap.get(CustomIds.COOL_SUMMER_PROJECT);

  return (
    <fieldset className='job-search-form__checkboxes'>
      <legend className='job-search-form__checkboxes-legend'>
        {Drupal.t('Filters', {}, { context: 'Checkbox filters heading' })}
      </legend>
      {showContinuous && (
        <Checkbox
          checked={continuous}
          className='job-search-form__checkbox'
          id={SearchComponents.CONTINUOUS}
          label={Drupal.t(
            'Open-ended vacancies',
            {},
            { context: 'Job search' },
          )}
          name={SearchComponents.CONTINUOUS}
          onClick={() =>
            setStateValue({
              key: SearchComponents.CONTINUOUS,
              value: !continuous,
            })
          }
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
          onClick={() =>
            setStateValue({
              key: SearchComponents.INTERNSHIPS,
              value: !internship,
            })
          }
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
          onClick={() =>
            setStateValue({
              key: SearchComponents.SUMMER_JOBS,
              value: !summerJobs,
            })
          }
          value={summerJobs.toString()}
          style={defaultCheckboxStyle}
        />
      )}
      {showYouthSummerJobs && (
        <Checkbox
          checked={youthSummerJobs}
          className='job-search-form__checkbox'
          id={SearchComponents.YOUTH_SUMMER_JOBS}
          label={Drupal.t(
            'Summer jobs for young people',
            {},
            { context: 'Job search' },
          )}
          name={SearchComponents.YOUTH_SUMMER_JOBS}
          onClick={() =>
            setStateValue({
              key: SearchComponents.YOUTH_SUMMER_JOBS,
              value: !youthSummerJobs,
            })
          }
          value={youthSummerJobs.toString()}
          style={defaultCheckboxStyle}
        />
      )}
    </fieldset>
  );
};
