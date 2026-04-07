import { Checkbox, DateInput } from 'hds-react';
import { useState } from 'react';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import { defaultDatePickerStyle } from '@/react/common/constants/datePickerStyle';
import Collapsible from './Collapsible';
import { addDays, formatHDSDate, parseHDSDate } from './helpers/dateUtils';
import getDateString from './helpers/GetDateString';

const dateHelperText = Drupal.t('Use the format D.M.YYYY', {}, { context: 'React search: date range select' });

const isOutOfRange = ({ endDate, startDate }: { startDate: Date | undefined; endDate: Date | undefined }): boolean =>
  !!(startDate && endDate && startDate.getTime() >= endDate.getTime());

const INVALID_DATE = (dt: Date | null | undefined): boolean => {
  if (!dt) return false;
  return Number.isNaN(dt.getTime()) || dt.getFullYear() > 9999;
};

export const DateRangeSelect = ({
  dialogLabel = Drupal.t('Choose date', {}, { context: 'React search: date range select' }),
  endDate,
  endDateHelperText = dateHelperText,
  endDateId = 'end-date',
  endDateLabel = Drupal.t('Last day of the time period', {}, { context: 'React search: date range select' }),
  endDisabled,
  helperText = Drupal.t('Select a time period for the event', {}, { context: 'React search: date range select' }),
  id,
  label,
  language = 'fi',
  setEnd,
  setEndDisabled,
  setStart,
  startDate,
  startDateHelperText = dateHelperText,
  startDateId = 'start-date',
  startDateLabel = Drupal.t('First day of the time period', {}, { context: 'React search: date range select' }),
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
}) => {
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});

  const collapsibleTitleText = getDateString({
    endDate: endDate ? (parseHDSDate(endDate) ?? undefined) : undefined,
    startDate: startDate ? (parseHDSDate(startDate) ?? undefined) : undefined,
  });
  const collapsibleTitleSRText = getDateString({
    endDate: endDate ? (parseHDSDate(endDate) ?? undefined) : undefined,
    startDate: startDate ? (parseHDSDate(startDate) ?? undefined) : undefined,
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

  const startDateErrorText = Drupal.t('Invalid start date', {}, { context: 'React search: date range select' });
  const endDateErrorText = Drupal.t('Invalid end date', {}, { context: 'React search: date range select' });

  const onStartChange = (d: string) => {
    if (d.length === 0) {
      setStart(undefined);
      setErrors({ ...errors, start: undefined });
      return;
    }
    const start = parseHDSDate(d);
    if (!start || INVALID_DATE(start)) {
      console.warn('invalid start date', { d });
      setErrors({ ...errors, start: startDateErrorText });
      return;
    }
    const end = endDate ? parseHDSDate(endDate) : undefined;
    if (isOutOfRange({ startDate: start, endDate: end ?? undefined }) && end) {
      console.warn('Selected start date is out of range with end date, setting end date to next day after start date.');
      setEnd(formatHDSDate(addDays(start, 1)));
    }
    setStart(formatHDSDate(start));
    setErrors({ ...errors, start: undefined });
  };

  const onEndChange = (d: string) => {
    if (d.length === 0) {
      setEnd(undefined);
      setErrors({ ...errors, end: undefined });
      return;
    }
    const end = parseHDSDate(d);
    if (!end || INVALID_DATE(end)) {
      console.warn('invalid end date', { d });
      setErrors({ ...errors, end: endDateErrorText });
      return;
    }
    const start = startDate ? parseHDSDate(startDate) : undefined;
    if (isOutOfRange({ startDate: start ?? undefined, endDate: end }) && start) {
      console.warn('Selected end date is out of range, setting end date to next day after start date.');
      setEnd(formatHDSDate(start));
    } else {
      setEnd(formatHDSDate(end));
    }
    setErrors({ ...errors, end: undefined });
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
