import React, { FormEvent, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import LocationFilter from '../components/LocationFilter';
import ApiKeys from '../enum/ApiKeys';
import SubmitButton from '../components/SubmitButton';
import DateSelect from '../components/DateSelect';
import CheckboxFilter from '../components/CheckboxFilter';
import SelectionsContainer from './SelectionsContainer';
import HDS_DATE_FORMAT from '../utils/HDS_DATE_FORMAT';
import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import {
  pageAtom,
  queryBuilderAtom,
  settingsAtom,
  urlAtom,
  titleAtom,
  submitValueAtom,
  freeFilterAtom,
  remoteFilterAtom,
  startDateAtom,
  endDateAtom,
  endDisabledAtom
} from '../store';

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

type FormErrors = {
  invalidEndDate: boolean,
  invalidStartDate: boolean,
};

function FormContainer({ loading }: {
  loading: boolean
}) {
  const [errors, setErrors] = useState<FormErrors>({
    invalidEndDate: false,
    invalidStartDate: false,
  });
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const [endDisabled, disableEnd] = useAtom(endDisabledAtom);
  const [freeFilter, setFreeFilter] = useAtom(freeFilterAtom);
  const [remoteFilter, setRemoteFilter] = useAtom(remoteFilterAtom);
  const [submitValue, setSubmitValue] = useAtom(submitValueAtom);
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const filterSettings = useAtomValue(settingsAtom);
  const eventListTitle = useAtomValue(titleAtom);
  const setUrl = useSetAtom(urlAtom);
  const setPage = useSetAtom(pageAtom);
  const { showLocation, showFreeFilter, showRemoteFilter, showTimeFilter } = filterSettings;

  if (!queryBuilder || !filterSettings) {
    return null;
  }

  const onSubmit = () => {
    setSubmitValue(submitValue+1);
    setPage(1);
    setUrl(queryBuilder.updateUrl());
  };

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
        queryBuilder.resetParam(key);
        return;
      }
      if (date.isValid) {
        queryBuilder.setParams({ [key]: date.toISODate() });
      } else {
        console.warn('invalid date given to setDate', { date });
      }
    };

    setDate(ApiKeys.START, startDate);

    if (endDisabled) {
      setDate(ApiKeys.END, startDate);
    }

    if (!endDisabled) {
      setDate(ApiKeys.END, endDate);
    }

  }, [startDate, endDate, endDisabled, queryBuilder]);


  const toggleFreeEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event?.target?.checked;

    if (!checked) {
      setFreeFilter(false);
      queryBuilder.resetParam(ApiKeys.FREE);
      return;
    }

    setFreeFilter(true);
    queryBuilder.setParams({ [ApiKeys.FREE]: 'true' });
  };

  const toggleRemoteEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.checked) {
      setRemoteFilter(false);
      queryBuilder.resetParam(ApiKeys.REMOTE);
      return;
    }

    setRemoteFilter(true);
    queryBuilder.setParams({ [ApiKeys.REMOTE]: 'true' });
  };
  const handleDisableEnd = () => {
    disableEnd(!endDisabled);
    setErrors({ ...errors, invalidEndDate: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(); return false;
  };

  const bothCheckboxes = showFreeFilter && showRemoteFilter;
  const showOnlyLabel = Drupal.t('Show only', {}, { context: 'Event search: event type prefix' });
  const freeTranslation = Drupal.t('Free-of-charge events');
  const remoteTranslation = Drupal.t('Remote events');
  const freeLabel = bothCheckboxes ? freeTranslation : `${showOnlyLabel} ${freeTranslation.toLowerCase()}`;
  const remoteLabel = bothCheckboxes ? remoteTranslation : `${showOnlyLabel} ${remoteTranslation.toLowerCase()}`;

  const showForm = showLocation || showFreeFilter || showTimeFilter || showRemoteFilter;
  const HeadingTag = eventListTitle ? 'h3' : 'h2';

  if (!showForm) {
    return null;
  }

  return (
    <form className='event-form-container' onSubmit={handleSubmit}>
      <HeadingTag className='event-list__filter-title'>{Drupal.t('Filter events', {}, { context: 'Event search: search form title' })}</HeadingTag>
      <div className='event-form__filters-container'>
        <div className='event-form__filter-section-container'>
          {
            showLocation &&
              <LocationFilter />
          }
          {
            showTimeFilter &&
              <DateSelect
                endDate={endDate}
                invalidEndDate={errors.invalidEndDate}
                invalidStartDate={errors.invalidStartDate}
                endDisabled={endDisabled}
                disableEnd={handleDisableEnd}
                setEndDate={setEnd}
                setStartDate={setStart}
                startDate={startDate}
                // outOfRangeError={errors.outOfRange}
              />
          }
        </div>
        {
          bothCheckboxes &&
          <div className='event-form__checkboxes-label'>{showOnlyLabel}</div>
        }
        <div className='event-form__filter-checkbox-container'>
          {
            showRemoteFilter &&
              <CheckboxFilter
                checked={remoteFilter}
                id='remote-toggle'
                label={remoteLabel}
                onChange={toggleRemoteEvents}
              />
          }
          {
            showFreeFilter &&
              <CheckboxFilter
                checked={freeFilter}
                id='free-toggle'
                label={freeLabel}
                onChange={toggleFreeEvents}
              />
          }
        </div>
        <SubmitButton disabled={errors.invalidEndDate || errors.invalidStartDate} />
        <SelectionsContainer submitValue={submitValue} />
      </div>
    </form>
  );
}

export default FormContainer;
