import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';

import HDS_DATE_FORMAT from '../utils/HDS_DATE_FORMAT';
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
import { DateRangeSelect } from '@/react/common/DateRangeSelect';

function DateSelect() {
  const endDisabled = useAtomValue(endDisabledAtom);
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const [errors, setErrors] = useAtom(formErrorsAtom);
  const resetParam = useSetAtom(resetParamAtom);
  const updateParams = useSetAtom(updateParamsAtom);
;
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
    <DateRangeSelect
      endDate={endDate?.toFormat(HDS_DATE_FORMAT)}
      id={SearchComponents.DATE}
      label={Drupal.t('Date', {}, {context: 'React search: date selection label'})}
      setEnd={(d) => setEndDate(d ? DateTime.fromFormat(d, HDS_DATE_FORMAT) : undefined)}
      setStart={(d) => setStartDate(d ? DateTime.fromFormat(d, HDS_DATE_FORMAT) : undefined)}
      startDate={startDate?.toFormat(HDS_DATE_FORMAT)}
      title={Drupal.t('Date', {}, {context: 'Events search'})}
    />
  );

}

export default DateSelect;
