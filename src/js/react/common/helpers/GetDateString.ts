import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import { formatHDSDate } from './dateUtils';

export const getDateString = ({ startDate, endDate, showLabels }: DateSelectDateTimes): string => {
  if (!startDate && !endDate) {
    return Drupal.t('All dates', {}, { context: 'Date select' });
  }

  if (startDate && !endDate) {
    if (showLabels) {
      return Drupal.t('From @date', { '@date': formatHDSDate(startDate) }, { context: 'Date select' });
    }
    return formatHDSDate(startDate);
  }

  if (!startDate && endDate) {
    if (showLabels) {
      return Drupal.t('Until @date', { '@date': formatHDSDate(endDate) }, { context: 'Date select' });
    }
    return `- ${formatHDSDate(endDate)}`;
  }

  if (startDate && endDate) {
    if (showLabels) {
      return Drupal.t(
        'From @date until @date2',
        { '@date': formatHDSDate(startDate), '@date2': formatHDSDate(endDate) },
        { context: 'Date select' },
      );
    }
    return `${formatHDSDate(startDate)} - ${formatHDSDate(endDate)}`;
  }

  return Drupal.t('All dates', {}, { context: 'Date select' });
};

export default getDateString;
