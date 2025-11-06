import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { DateTime } from 'luxon';
import { DateRangeSelect } from '@/react/common/DateRangeSelect';
import SearchComponents from '../enum/SearchComponents';
import {
  endDateAtom,
  endDisabledAtom,
  formErrorsAtom,
  setEndDisabledAtom,
  startDateAtom,
  updateDateAtom,
} from '../store';
import HDS_DATE_FORMAT from '../utils/HDS_DATE_FORMAT';

function DateSelect() {
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const updateDate = useSetAtom(updateDateAtom);
  const [errors, setErrors] = useAtom(formErrorsAtom);
  const endDisabled = useAtomValue(endDisabledAtom);
  const setEndDisabled = useSetAtom(setEndDisabledAtom);

  const setDate = (dateString: string | undefined, key: string) => {
    const errorKey = key === 'start' ? 'invalidStartDate' : 'invalidEndDate';
    let date: DateTime | undefined;

    if (!dateString) {
      updateDate(undefined, key);
    } else {
      date = DateTime.fromFormat(dateString, HDS_DATE_FORMAT);
      updateDate(date, key);
    }

    setErrors({ ...errors, [errorKey]: date ? !date.isValid : false });
  };

  return (
    <DateRangeSelect
      endDate={endDate?.toFormat(HDS_DATE_FORMAT)}
      endDisabled={endDisabled}
      id={SearchComponents.DATE}
      label={Drupal.t(
        'Date',
        {},
        { context: 'React search: date selection label' },
      )}
      setEnd={(d) => setDate(d, 'end')}
      setEndDisabled={setEndDisabled}
      setStart={(d) => setDate(d, 'start')}
      startDate={startDate?.toFormat(HDS_DATE_FORMAT)}
      title={Drupal.t('Date', {}, { context: 'Events search' })}
    />
  );
}

export default DateSelect;
