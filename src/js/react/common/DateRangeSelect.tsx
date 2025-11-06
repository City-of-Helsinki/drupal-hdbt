import { Checkbox, DateInput } from 'hds-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import { defaultDatePickerStyle } from '@/react/common/constants/datePickerStyle';
import Collapsible from './Collapsible';
import { HDS_DATE_FORMAT } from './enum/HDSDateFormat';
import getDateString from './helpers/GetDateString';

const dateHelperText = Drupal.t(
  'Use the format D.M.YYYY',
  {},
  { context: 'React search: date range select' },
);
const getDateTimeFromHDSFormat = (d: string): DateTime =>
  DateTime.fromFormat(d, HDS_DATE_FORMAT, { locale: 'fi' });

// End date must be after start date. But only if both are defined.
const isOutOfRange = ({ endDate, startDate }: DateSelectDateTimes): boolean =>
  !!(startDate && endDate && startDate.startOf('day') >= endDate.endOf('day'));

type DateSelectDateTimes = {
  startDate: DateTime | undefined;
  endDate: DateTime | undefined;
};

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
  dialogLabel = Drupal.t(
    'Choose date',
    {},
    { context: 'React search: date range select' },
  ),
  endDate,
  endDateHelperText = dateHelperText,
  endDateId = 'end-date',
  endDateLabel = Drupal.t(
    'Last day of the time period',
    {},
    { context: 'React search: date range select' },
  ),
  endDisabled,
  helperText = Drupal.t(
    'Select a time period for the event',
    {},
    { context: 'React search: date range select' },
  ),
  id,
  label,
  language = 'fi',
  setEnd,
  setEndDisabled,
  setStart,
  startDate,
  startDateHelperText = dateHelperText,
  startDateId = 'start-date',
  startDateLabel = Drupal.t(
    'First day of the time period',
    {},
    { context: 'React search: date range select' },
  ),
  // biome-ignore lint/correctness/noUnusedFunctionParameters: @todo UHF-12501
  title,
}: {
  dialogLabel?: string;
  endDate?: string;
  endDateHelperText?: string;
  endDateId?: string;
  endDateLabel?: string;
  endDisabled?: boolean;
  helperText?: string;
  id: string;
  label: string;
  language?: 'fi' | 'en' | 'sv';
  setEnd: (d?: string) => void;
  setEndDisabled: (disabled: boolean) => void;
  setStart: (d?: string) => void;
  startDate?: string;
  startDateHelperText?: string;
  startDateId?: string;
  startDateLabel?: string;
  title: string;
}) => {
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});

  const collapsibleTitleText = getDateString({
    endDate: endDate
      ? DateTime.fromFormat(endDate, HDS_DATE_FORMAT, { locale: 'fi' })
      : undefined,
    startDate: startDate
      ? DateTime.fromFormat(startDate, HDS_DATE_FORMAT, { locale: 'fi' })
      : undefined,
  });
  const collapsibleTitleSRText = getDateString({
    endDate: endDate
      ? DateTime.fromFormat(endDate, HDS_DATE_FORMAT, { locale: 'fi' })
      : undefined,
    startDate: startDate
      ? DateTime.fromFormat(startDate, HDS_DATE_FORMAT, { locale: 'fi' })
      : undefined,
    showLabels: true,
  });
  const collapsibleTitleSRLabel = Drupal.t(
    'Selected time period: @period',
    { '@period': collapsibleTitleSRText },
    { context: 'React search: date range select' },
  );
  const collapsibleTitle = (
    <>
      <span className='visually-hidden'>{collapsibleTitleSRLabel}</span>
      <span aria-hidden='true'>{collapsibleTitleText}</span>
    </>
  );

  const startDateErrorText = Drupal.t(
    'Invalid start date',
    {},
    { context: 'React search: date range select' },
  );
  const endDateErrorText = Drupal.t(
    'Invalid end date',
    {},
    { context: 'React search: date range select' },
  );

  const onStartChange = (d: string) => {
    const end = endDate ? getDateTimeFromHDSFormat(endDate) : undefined;
    const start = getDateTimeFromHDSFormat(d);

    if (INVALID_DATE(start)) {
      console.warn('invalid start date', { start, end });
      if (d.length === 0) {
        setStart(undefined);
        setErrors({ ...errors, start: undefined });
      } else {
        setErrors({ ...errors, start: startDateErrorText });
      }
    } else {
      if (isOutOfRange({ startDate: start, endDate: end }) && end) {
        console.warn(
          'Selected start date is out of range with end date, setting end date to next day after start date.',
        );
        setEnd(start.plus({ days: 1 }).toFormat(HDS_DATE_FORMAT));
      }
      setStart(start.toFormat(HDS_DATE_FORMAT));
      setErrors({ ...errors, start: undefined });
    }
  };

  const onEndChange = (d: string) => {
    const start = startDate ? getDateTimeFromHDSFormat(startDate) : undefined;
    const end = getDateTimeFromHDSFormat(d);

    if (INVALID_DATE(end)) {
      console.warn('invalid end date', { end, d });
      if (d.length === 0) {
        setErrors({ ...errors, end: undefined });
        setEnd(undefined);
      } else {
        setErrors({ ...errors, end: endDateErrorText });
      }
    } else {
      if (isOutOfRange({ startDate: start, endDate: end }) && start) {
        console.warn(
          'Selected end date is out of range, setting end date to next day after start date.',
        );
        setEnd(start.toFormat(HDS_DATE_FORMAT));
      } else {
        setEnd(end.toFormat(HDS_DATE_FORMAT));
      }
      setErrors({ ...errors, end: undefined });
    }
  };

  return (
    <div className='hdbt-search__filter hdbt-search--react__dropdown'>
      <Collapsible
        {...{ id, label, dialogLabel }}
        isPlaceholder={!startDate && !endDate}
        helper={helperText}
        title={collapsibleTitle}
      >
        <div className='event-form__date-container'>
          <DateInput
            className='hdbt-search__filter hdbt-search__date-input'
            errorText={errors.start}
            helperText={startDateHelperText}
            id={startDateId}
            invalid={!!errors.start}
            label={startDateLabel}
            language={language}
            onChange={onStartChange}
            value={startDate}
            style={defaultDatePickerStyle}
          />
          <Checkbox
            checked={endDisabled}
            id='date-range-select__end-date-disabled'
            label={Drupal.t(
              'The last day of the time period is the same as the first day',
              {},
              { context: 'React search: date range select' },
            )}
            onChange={() => setEndDisabled(!endDisabled)}
            style={defaultCheckboxStyle}
          />
          {!endDisabled && (
            <DateInput
              className='hdbt-search__filter hdbt-search__date-input'
              errorText={errors.end}
              helperText={endDateHelperText}
              id={endDateId}
              invalid={!!errors.end}
              label={endDateLabel}
              language={language}
              onChange={onEndChange}
              value={endDate}
              style={defaultDatePickerStyle}
            />
          )}
        </div>
      </Collapsible>
    </div>
  );
};
