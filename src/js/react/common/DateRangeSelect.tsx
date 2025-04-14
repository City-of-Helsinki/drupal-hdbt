import { DateInput } from 'hds-react';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import Collapsible from './Collapsible';
import getDateString from './helpers/GetDateString';
import { HDS_DATE_FORMAT } from './enum/HDSDateFormat';

const dateHelperText = Drupal.t('Use the format D.M.YYYY', {}, {context: 'Events search'});
const getDateTimeFromHDSFormat = (d: string): DateTime => DateTime.fromFormat(d, HDS_DATE_FORMAT, { locale: 'fi' });

// End date must be after start date. But only if both are defined.
const isOutOfRange = ({ endDate, startDate }: DateSelectDateTimes): boolean => !!(startDate && endDate && startDate.startOf('day') >= endDate.startOf('day'));

type DateSelectDateTimes = {
  startDate: DateTime | undefined;
  endDate : DateTime | undefined;
}

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

export const DateRangeSelect = ({
  endDate,
  endDateHelperText = dateHelperText,
  endDateId = 'end-date',
  endDateLabel = Drupal.t('Last day of the time period', {}, {context: 'Events search'}),
  id,
  label,
  language = 'fi',
  onChange,
  startDate,
  startDateHelperText = dateHelperText,
  startDateId = 'start-date',
  startDateLabel = Drupal.t('First day of the time period', {}, {context: 'Events search'}),
  title,
}: {
  endDate?: string,
  endDateHelperText?: string,
  endDateId?: string,
  endDateLabel?: string,
  id: string,
  label: string,
  language?: 'fi' | 'en' | 'sv',
  onChange: (start: string|undefined, end: string|undefined) => void,
  startDate?: string,
  startDateHelperText?: string,
  startDateId?: string,
  startDateLabel?: string,
  title: string,
}) => {
  const [endDateValue, setEndDateValue] = useState(startDate);
  const [startDateValue, setStartDateValue] = useState(startDate);
  const [errors, setErrors] = useState<{start?: string, end?: string}>({});

  useEffect(() => {
    onChange(startDateValue, endDateValue);
  }, [startDateValue, endDateValue]);

  const collapibleTitle = getDateString({
    endDate: endDateValue ? DateTime.fromFormat(endDateValue, HDS_DATE_FORMAT, { locale: 'fi' }) : undefined,
    startDate: startDateValue ? DateTime.fromFormat(startDateValue, HDS_DATE_FORMAT, { locale: 'fi' }) : undefined,
  });

  const startDateErrorText = Drupal.t('Invalid start date', {}, {context: 'Events search'});
  const endDateErrorText = Drupal.t('Invalid end date', {}, {context: 'Events search'});

  const setStart = (d: string) => {
    const end = endDateValue ? getDateTimeFromHDSFormat(endDateValue) : undefined;
    const start = getDateTimeFromHDSFormat(d);

    if (INVALID_DATE(start)) {
      console.warn('invalid start date', { start, end });
      if (d.length === 0) {
        setStartDateValue(undefined);
        setErrors({ ...errors, start: undefined });
      } else {
        setErrors({ ...errors, start: startDateErrorText });
      }
    } else {
      if (isOutOfRange({ startDate: start, endDate: end }) && end) {
        console.warn('Selected start date is out of range with end date, setting end date to next day after start date.');
        setEndDateValue(start.plus({ 'days': 1 }).toFormat(HDS_DATE_FORMAT));
      }
      setStartDateValue(start.toFormat(HDS_DATE_FORMAT));
      setErrors({ ...errors, start: undefined });
    }
  };

  const setEnd = (d: string) => {
    const start = startDateValue ? getDateTimeFromHDSFormat(startDateValue) : undefined;
    const end = getDateTimeFromHDSFormat(d);

    if (INVALID_DATE(end)) {
      console.warn('invalid end date', { end, d });
      if (d.length === 0) {
        setErrors({ ...errors, end: undefined });
        setEndDateValue(undefined);
      } else {
        setErrors({ ...errors, end: endDateErrorText });
      }
    } else {
      if (isOutOfRange({ startDate: start, endDate: end }) && start) {
        console.warn('Selected end date is out of range, setting end date to next day after start date.');
        setEndDateValue(start.plus({ 'days': 1 }).toFormat(HDS_DATE_FORMAT));
      } else {
        setEndDateValue(end.toFormat(HDS_DATE_FORMAT));
      }
      setErrors({ ...errors, end: undefined });
    }
  };

  return (
    <div className='hdbt-search__filter event-form__filter--date'>
      <Collapsible {...{id, label}} title={collapibleTitle} >
        <div className='event-form__date-container'>
          <DateInput
            className='hdbt-search__filter hdbt-search__date-input'
            errorText={errors.start}
            helperText={startDateHelperText}
            id={startDateId}
            invalid={!!errors.start}
            label={startDateLabel}
            language={language}
            onChange={setStart}
            value={startDateValue}
          />
          <DateInput
            className='hdbt-search__filter hdbt-search__date-input'
            errorText={errors.end}
            helperText={endDateHelperText}
            id={endDateId}
            invalid={!!errors.end}
            label={endDateLabel}
            language={language}
            onChange={setEnd}
            value={endDateValue}
          />
        </div>
      </Collapsible>
    </div>
  );
};
