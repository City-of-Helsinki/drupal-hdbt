import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { DateInput } from 'hds-react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';

import Collapsible from './Collapsible';
import CheckboxFilter from './CheckboxFilter';
import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import HDS_DATE_FORMAT from '../utils/HDS_DATE_FORMAT';
import getDateString from '../helpers/GetDate';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import {
  startDateAtom,
  endDateAtom,
  endDisabledAtom,
  formErrorsAtom,
  resetParamAtom,
  updateParamsAtom,
} from '../store';

const dateHelperText = Drupal.t('Use the format D.M.YYYY', {}, {context: 'Events search'});

const getDateTimeFromHDSFormat = (d: string): DateTime => DateTime.fromFormat(d, HDS_DATE_FORMAT, { locale: 'fi' });

// End date must be after start date. But only if both are defined.
const isOutOfRange = ({ endDate, startDate }: DateSelectDateTimes): boolean => !!(startDate && endDate && startDate.startOf('day') >= endDate.startOf('day'));

// Date must be in within the next 1000 years or so....
// This also validates that the string is not too long even though it might be valid.
const INVALID_DATE = (dt: DateTime | undefined): boolean => {

  if (!dt) {
    return false;
  }

  if (dt.year > 9999) {
    return true;
  }

  return !dt.isValid;
};

function DateSelect() {
  const { currentLanguage } = drupalSettings.path;
  const endDisabled = useAtomValue(endDisabledAtom);
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const [errors, setErrors] = useAtom(formErrorsAtom);
  const resetParam = useSetAtom(resetParamAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const changeDate = (value: string, date: 'start' | 'end') => {
    date === 'start' ? setStart(value) : setEnd(value);
  };

  const title = getDateString({ startDate, endDate });
  const startDateErrorText = errors.invalidStartDate ? Drupal.t('Invalid start date', {}, {context: 'Events search'}) : '';
  const endDateErrorText = errors.invalidEndDate ? Drupal.t('Invalid end date', {}, {context: 'Events search'}) : '';

  const setStart = (d: string) => {
    const start = getDateTimeFromHDSFormat(d);

    if (INVALID_DATE(start)) {
      console.warn('invalid start date', { start, endDate });
      if (d.length === 0) {
        setStartDate(undefined);
        setErrors({ ...errors, invalidStartDate: false });
      } else {
        setErrors({ ...errors, invalidStartDate: true });
      }
    } else {
      if (isOutOfRange({ startDate: start, endDate })) {
        console.warn('Selected start date is out of range with end date, setting end date to next day after start date.');
        setEndDate(start?.plus({ 'days': 1 }));
      }
      setStartDate(start);
      setErrors({ ...errors, invalidStartDate: false });
    }
  };

  const setEnd = (d: string) => {
    const end = getDateTimeFromHDSFormat(d);

    if (INVALID_DATE(end)) {
      console.warn('invalid end date', { end, d });
      if (d.length === 0) {
        setErrors({ ...errors, invalidEndDate: false });
        setEndDate(undefined);
      } else {
        setErrors({ ...errors, invalidEndDate: true });
      }
    } else {
      if (isOutOfRange({ startDate, endDate: end })) {
        console.warn('Selected end date is out of range, setting end date to next day after start date.');
        setEndDate(startDate?.plus({ 'days': 1 }));
      } else {
        setEndDate(end);
      }
      setErrors({ ...errors, invalidEndDate: false });
    }
  };

  useEffect(() => {
    const setDate = (key: string, date: DateTime | undefined) => {
      if (!date || !date.isValid) {
        resetParam(key);
        return;
      }
      if (date.isValid) {
        updateParams({ [key]: date.toISODate() });
      } else {
        console.warn('invalid date given to setDate', { date });
      }
    };

    setDate(ApiKeys.START, startDate);

    if (endDisabled) {
      setDate(ApiKeys.END, startDate);
      setEndDate(startDate);
      setErrors({ ...errors, invalidEndDate: false });
    }

    if (!endDisabled) {
      setDate(ApiKeys.END, endDate);
      setEndDate(endDate);
      setErrors({ ...errors, invalidEndDate: false });
    }

  }, [startDate, endDate, endDisabled]);

  return (
    <div className='hdbt-search__filter event-form__filter--date'>
      <Collapsible
        id='event-search__date-select'
        label={Drupal.t('Date', {}, { context: 'React search: date selection label' })}
        helper={Drupal.t('Select a time period in which the event takes place', {}, {context: 'Events search'})}
        title={title}
      >
        <div className='event-form__date-container'>
          <DateInput
            className='hdbt-search__filter hdbt-search__date-input'
            helperText={dateHelperText}
            id='start-date'
            label={Drupal.t('First day of the time period', {}, {context: 'Events search'})}
            language={currentLanguage}
            invalid={errors.invalidStartDate}
            errorText={startDateErrorText}
            value={startDate?.toFormat(HDS_DATE_FORMAT)}
            onChange={(value: string) => changeDate(value, 'start')}
          />
          <CheckboxFilter
            id='end-disabled'
            label={Drupal.t('The last day of the time period is the same as the first day', {}, {context: 'Events search'})}
            atom={endDisabledAtom}
            valueKey={SearchComponents.END_DISABLED}
          />
          <DateInput
            minDate={endDisabled ? undefined : startDate?.plus({ 'days': 1 }).toJSDate()}
            className='hdbt-search__filter hdbt-search__date-input'
            disabled={endDisabled}
            helperText={dateHelperText}
            id='end-date'
            label={Drupal.t('Last day of the time period', {}, {context: 'Events search'})}
            language={currentLanguage}
            invalid={errors.invalidEndDate}
            errorText={endDateErrorText}
            value={endDisabled ? startDate?.toFormat(HDS_DATE_FORMAT) : endDate?.toFormat(HDS_DATE_FORMAT)}
            onChange={(value: string) => changeDate(value, 'end')}
          />
        </div>
      </Collapsible>
    </div>
  );

}

export default DateSelect;
