import type { DateTime } from 'luxon';

interface DateSelectDateTimes {
  startDate: DateTime | undefined;
  endDate: DateTime | undefined;
  showLabels?: boolean;
}

export default DateSelectDateTimes;
