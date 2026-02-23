import CardItem, { Metarow } from '@/react/common/Card';
import type VehicleRemoval from '../types/VehicleRemoval';

const formatUnixToHumanReadable = (unix: string | number): string | undefined => {
  const unixTimestamp = typeof unix === 'string' ? Number(unix) : unix;
  if (!Number.isFinite(unixTimestamp)) return undefined;

  const humanReadableDate = new Date(unixTimestamp * 1000);

  const day = humanReadableDate.getDate();
  const month = humanReadableDate.getMonth() + 1;
  const year = humanReadableDate.getFullYear();

  return `${day}.${month}.${year}`;
};

const normalizeScalar = (value: unknown): string | number | null | undefined => {
  if (Array.isArray(value)) return value[0];
  return value as string | number | null | undefined;
};

const EMPTY_META_VALUE = '-';

const formatValidityRange = (from?: string | number | null, to?: string | number | null): string => {
  // No date is set at all.
  if (!from && !to) return EMPTY_META_VALUE;
  if (from == null || to == null) return EMPTY_META_VALUE;

  // Only start date or end date is set.
  if (from && !to) return formatUnixToHumanReadable(from) ?? EMPTY_META_VALUE;
  if (!from && to) return formatUnixToHumanReadable(to) ?? EMPTY_META_VALUE;

  const fromNum = typeof from === 'string' ? Number(from) : from;
  const toNum = typeof to === 'string' ? Number(to) : to;

  // Fallback to empty string if the conversion fails.
  if (!Number.isFinite(fromNum) || !Number.isFinite(toNum)) return EMPTY_META_VALUE;

  const startDate = new Date(fromNum * 1000);
  const endDate = new Date(toNum * 1000);

  // The dates are the same.
  if (startDate.getTime() === endDate.getTime()) return formatUnixToHumanReadable(fromNum) ?? EMPTY_META_VALUE;

  const startDateHumanReadable = formatUnixToHumanReadable(fromNum);
  const endDateHumanReadable = formatUnixToHumanReadable(toNum);
  if (!startDateHumanReadable || !endDateHumanReadable) return EMPTY_META_VALUE;

  // The dates are in different years.
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  if (!sameYear) return `${startDateHumanReadable}-${endDateHumanReadable}`;

  // The dates are in the same year.
  const startDateFormatted = `${startDate.getDate()}.${startDate.getMonth() + 1}.`;
  const endDateFormatted = `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;
  return `${startDateFormatted}-${endDateFormatted}`;
};

const ResultCard = ({ item }: { item: VehicleRemoval }) => (
  <CardItem
    cardTitle={item.address}
    customMetaRows={{
      top: [
        <Metarow
          key='validity'
          icon='calendar'
          label={Drupal.t('Period of validity', {}, { context: 'Vehicle removal search' })}
          content={formatValidityRange(normalizeScalar(item.valid_from), normalizeScalar(item.valid_to))}
        />,
        <Metarow
          key='time'
          icon='clock'
          label={Drupal.t('Time', {}, { context: 'Vehicle removal search' })}
          content={item.time_range}
        />,
      ],
    }}
  />
);

export default ResultCard;
