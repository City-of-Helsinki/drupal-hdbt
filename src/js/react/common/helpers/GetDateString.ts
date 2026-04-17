import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import { formatHDSDate } from './dateUtils';

export const getDateString = ({ startDate, endDate, showLabels }: DateSelectDateTimes): string => {
  if (!startDate && !endDate) {
    return Drupal.t('All dates', {}, { context: 'Events search' });
  }

  if (startDate && !endDate) {
    if (showLabels) {
      return Drupal.t('From @date', { '@date': formatHDSDate(startDate) }, { context: 'Events search' });
    }
    return formatHDSDate(startDate);
  }

  if (!startDate && endDate) {
    if (showLabels) {
      return Drupal.t('Until @date', { '@date': formatHDSDate(endDate) }, { context: 'Events search' });
    }
    return `- ${formatHDSDate(endDate)}`;
  }

  if (startDate && endDate) {
    if (showLabels) {
      return Drupal.t(
        'From @date until @date2',
        { '@date': formatHDSDate(startDate), '@date2': formatHDSDate(endDate) },
        { context: 'Events search' },
      );
    }
    return `${formatHDSDate(startDate)} - ${formatHDSDate(endDate)}`;
  }

  return Drupal.t('All dates', {}, { context: 'Events search' });
};

export default getDateString;
