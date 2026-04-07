import { formatHDSDate } from '@/react/common/helpers/dateUtils';
import type DateSelectDateTimes from '@/types/DateSelectDateTimes';

const getDateString = ({ startDate, endDate }: DateSelectDateTimes): string => {
  if (!startDate && !endDate) {
    return Drupal.t('All dates', {}, { context: 'Events search' });
  }

  if (startDate && !endDate) {
    return formatHDSDate(startDate);
  }

  if (!startDate && endDate) {
    return `- ${formatHDSDate(endDate)}`;
  }

  if (startDate && endDate) {
    return `${formatHDSDate(startDate)} - ${formatHDSDate(endDate)}`;
  }

  return Drupal.t('All dates', {}, { context: 'Events search' });
};

export default getDateString;
