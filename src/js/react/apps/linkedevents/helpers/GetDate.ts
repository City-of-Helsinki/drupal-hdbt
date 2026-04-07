import type DateSelectDateTimes from '@/types/DateSelectDateTimes';
import { formatHDSDate } from '@/react/common/helpers/dateUtils';

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

  return `${formatHDSDate(startDate!)} - ${formatHDSDate(endDate!)}`;
};

export default getDateString;
