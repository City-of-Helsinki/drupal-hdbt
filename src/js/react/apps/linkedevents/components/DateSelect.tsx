import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { DateRangeSelect } from '@/react/common/DateRangeSelect';
import { formatHDSDate, parseHDSDate } from '@/react/common/helpers/dateUtils';
import SearchComponents from '../enum/SearchComponents';
import {
  endDateAtom,
  endDisabledAtom,
  formErrorsAtom,
  setEndDisabledAtom,
  startDateAtom,
  updateDateAtom,
} from '../store';

function DateSelect() {
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const updateDate = useSetAtom(updateDateAtom);
  const [errors, setErrors] = useAtom(formErrorsAtom);
  const endDisabled = useAtomValue(endDisabledAtom);
  const setEndDisabled = useSetAtom(setEndDisabledAtom);

  const setDate = (dateString: string | undefined, key: string) => {
    const errorKey = key === 'start' ? 'invalidStartDate' : 'invalidEndDate';
    let date: Date | undefined;

    if (!dateString) {
      updateDate(undefined, key);
    } else {
      date = parseHDSDate(dateString) ?? undefined;
      updateDate(date, key);
    }

    setErrors({ ...errors, [errorKey]: date ? isNaN(date.getTime()) : false });
  };

  return (
    <DateRangeSelect
      endDate={endDate ? formatHDSDate(endDate) : undefined}
      endDisabled={endDisabled}
      id={SearchComponents.DATE}
      label={Drupal.t('Date', {}, { context: 'React search: date selection label' })}
      setEnd={(d) => setDate(d, 'end')}
      setEndDisabled={setEndDisabled}
      setStart={(d) => setDate(d, 'start')}
      startDate={startDate ? formatHDSDate(startDate) : undefined}
      title={Drupal.t('Date', {}, { context: 'Events search' })}
    />
  );
}

export default DateSelect;
