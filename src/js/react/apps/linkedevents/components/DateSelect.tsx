import { DateTime } from 'luxon';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import HDS_DATE_FORMAT from '../utils/HDS_DATE_FORMAT';
import SearchComponents from '../enum/SearchComponents';
import {
  startDateAtom,
  endDateAtom,
  formErrorsAtom,
  updateDateAtom,
} from '../store';
import { DateRangeSelect } from '@/react/common/DateRangeSelect';

function DateSelect() {
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const updateDate = useSetAtom(updateDateAtom);
  const [errors, setErrors] = useAtom(formErrorsAtom);

  const setDate = (dateString: string|undefined, key: string) => {
    const errorKey = key === 'start' ? 'invalidStartDate' : 'invalidEndDate';
    
    if (!dateString) {
      updateDate(undefined, key);
    }
    else {
      updateDate(DateTime.fromFormat(dateString, HDS_DATE_FORMAT), key);
    }

    setErrors({...errors, [errorKey]: Boolean(date.invalid)});
  };

  return (
    <DateRangeSelect
      endDate={endDate?.toFormat(HDS_DATE_FORMAT)}
      id={SearchComponents.DATE}
      label={Drupal.t('Date', {}, {context: 'React search: date selection label'})}
      setEnd={(d) => setDate(d, 'end')}
      setStart={(d) => setDate(d ,'start')}
      startDate={startDate?.toFormat(HDS_DATE_FORMAT)}
      title={Drupal.t('Date', {}, {context: 'Events search'})}
    />
  );

}

export default DateSelect;
