import { DateInput } from 'hds-react';
import Collapsible from './Collapsible';
import CheckboxFilter from './CheckboxFilter';
import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import HDS_DATE_FORMAT from '../utils/HDS_DATE_FORMAT';
import getDateString from '../helpers/GetDate';

interface DateSelectActions {
  endDisabled: boolean;
  disableEnd: Function;
  setEndDate: Function;
  setStartDate: Function;
  invalidStartDate?: boolean;
  invalidEndDate?: boolean;
}

type DateSelectProps = DateSelectDateTimes & DateSelectActions;

const dateHelperText = Drupal.t('Use the format D.M.YYYY');

function DateSelect({ endDate, endDisabled, disableEnd, setEndDate, setStartDate, startDate, invalidStartDate = false, invalidEndDate = false }: DateSelectProps) {

  const { currentLanguage } = drupalSettings.path;

  const changeDate = (value: string, date: 'start' | 'end') => {
    date === 'start' ? setStartDate(value) : setEndDate(value);
  };

  const title = getDateString({ startDate, endDate });
  const startDateErrorText = invalidStartDate ? Drupal.t('Invalid start date') : '';
  const endDateErrorText = invalidEndDate ? Drupal.t('Invalid end date') : '';

  return (
    <div className='hdbt-search__filter event-form__filter--date'>
      <Collapsible
        id='event-search__date-select'
        label={Drupal.t('Date', {}, { context: 'Event search: date selection label' })}
        helper={Drupal.t('Select a time period in which in which the event takes place')}
        title={title}
      >
        <div className='event-form__date-container'>
          <DateInput
            className='hdbt-search__filter hdbt-search__date-input'
            helperText={dateHelperText}
            id='start-date'
            label={Drupal.t('First day of the time period')}
            language={currentLanguage}
            invalid={invalidStartDate}
            errorText={startDateErrorText}
            value={startDate?.toFormat(HDS_DATE_FORMAT)}
            onChange={(value: string) => changeDate(value, 'start')}
          />
          <CheckboxFilter
            checked={endDisabled}
            id='end-disabled'
            label={Drupal.t('The last day of the time period is the same as the first day')}
            onChange={disableEnd}
          />
          <DateInput
            minDate={endDisabled ? undefined : startDate?.plus({ 'days': 1 }).toJSDate()}
            className='hdbt-search__filter hdbt-search__date-input'
            disabled={endDisabled}
            helperText={dateHelperText}
            id='end-date'
            label={Drupal.t('Last day of the time period')}
            language={currentLanguage}
            invalid={invalidEndDate}
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
