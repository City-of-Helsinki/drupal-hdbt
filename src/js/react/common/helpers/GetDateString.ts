import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import { HDS_DATE_FORMAT } from '../enum/HDSDateFormat';

export const getDateString = ({ startDate, endDate }: DateSelectDateTimes): string => {
  if ((!startDate || !startDate.isValid) && (!endDate || !endDate.isValid)) {
    return Drupal.t('All dates', {}, { context: 'Events search' });
  }

  if ((startDate && startDate.isValid) && (!endDate || !endDate.isValid)) {
    return startDate.toFormat(HDS_DATE_FORMAT);
  }

  if ((!startDate || !startDate.isValid) && endDate?.isValid) {
    return `- ${endDate.toFormat(HDS_DATE_FORMAT)}`;
  }
  return `${startDate?.toFormat(HDS_DATE_FORMAT) || 'unset?'} - ${endDate?.toFormat(HDS_DATE_FORMAT)}`;
};

export default getDateString;
