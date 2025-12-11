import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import { HDS_DATE_FORMAT } from '../enum/HDSDateFormat';

export const getDateString = ({ startDate, endDate, showLabels }: DateSelectDateTimes): string => {
  if ((!startDate || !startDate.isValid) && (!endDate || !endDate.isValid)) {
    return Drupal.t('All dates', {}, { context: 'Events search' });
  }

  if (startDate?.isValid && (!endDate || !endDate.isValid)) {
    if (showLabels) {
      return Drupal.t('From @date', { '@date': startDate.toFormat(HDS_DATE_FORMAT) }, { context: 'Events search' });
    }
    return startDate.toFormat(HDS_DATE_FORMAT);
  }

  if ((!startDate || !startDate.isValid) && endDate?.isValid) {
    if (showLabels) {
      return Drupal.t('Until @date', { '@date': endDate.toFormat(HDS_DATE_FORMAT) }, { context: 'Events search' });
    }
    return `- ${endDate.toFormat(HDS_DATE_FORMAT)}`;
  }

  if (showLabels) {
    return Drupal.t(
      'From @date until @date2',
      { '@date': startDate?.toFormat(HDS_DATE_FORMAT), '@date2': endDate?.toFormat(HDS_DATE_FORMAT) },
      { context: 'Events search' },
    );
  }

  return `${startDate?.toFormat(HDS_DATE_FORMAT) || 'unset?'} - ${endDate?.toFormat(HDS_DATE_FORMAT)}`;
};

export default getDateString;
