import CardItem, { Metarow } from '@/react/common/Card';
import type VehicleRemoval from '../types/VehicleRemoval';

const formatUnixToJNY = (unix: string | number): string | undefined => {
  const n = typeof unix === 'string' ? Number(unix) : unix;
  if (!Number.isFinite(n)) return undefined;

  const d = new Date(n * 1000);

  const j = d.getDate();
  const nMonth = d.getMonth() + 1;
  const Y = d.getFullYear();

  return `${j}.${nMonth}.${Y}`;
};

const EMPTY_META_VALUE = '–';

const formatValidityRange = (from?: string | number | null, to?: string | number | null): string => {
  if (!from && !to) return EMPTY_META_VALUE;

  if (from && !to) return formatUnixToJNY(from) ?? EMPTY_META_VALUE;
  if (!from && to) return formatUnixToJNY(to) ?? EMPTY_META_VALUE;

  if (from == null || to == null) return EMPTY_META_VALUE;

  const fromNum = typeof from === 'string' ? Number(from) : from;
  const toNum = typeof to === 'string' ? Number(to) : to;

  if (!Number.isFinite(fromNum) || !Number.isFinite(toNum)) return EMPTY_META_VALUE;

  const d1 = new Date(fromNum * 1000);
  const d2 = new Date(toNum * 1000);

  const d1Str = formatUnixToJNY(fromNum);
  const d2Str = formatUnixToJNY(toNum);
  if (!d1Str || !d2Str) return EMPTY_META_VALUE;

  const sameYear = d1.getFullYear() === d2.getFullYear();
  if (!sameYear) return `${d1Str}-${d2Str}`; // j.n.Y-j.n.Y

  const start = `${d1.getDate()}.${d1.getMonth() + 1}.`;
  const end = `${d2.getDate()}.${d2.getMonth() + 1}.${d2.getFullYear()}`;
  return `${start}-${end}`; // j.n.-j.n.Y
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
          content={formatValidityRange(item.valid_from, item.valid_to)}
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
