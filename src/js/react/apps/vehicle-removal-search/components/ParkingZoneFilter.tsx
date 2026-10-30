import { parkingZonesAtom } from '../store';
import { TermFilter } from './TermFilter';

/**
 * Build a case-insensitive regex for the terms aggregation include.
 *
 * Parking zone names are Finnish and may combine several parts of the city,
 * so the term is matched anywhere in the name. Only letters, numbers, spaces,
 * hyphens and slashes are kept, and the non-alphanumeric ones are escaped so
 * that it is safe to use in a regex.
 */
const toIncludePattern = (searchTerm: string): string => {
  const term = searchTerm.replace(/[^\p{L}\p{N} /-]/gu, '').trim();

  if (!term) {
    return '';
  }

  const pattern = Array.from(term)
    .map((char) => {
      if (char === ' ' || char === '-' || char === '/') {
        return `\\${char}`;
      }
      const lower = char.toLowerCase();
      const upper = char.toUpperCase();
      return lower === upper ? char : `[${lower}${upper}]`;
    })
    .join('');

  return `.*${pattern}.*`;
};

export const ParkingZoneFilter = () => (
  <TermFilter
    id='parking-zones'
    atom={parkingZonesAtom}
    field='parking_zone_names'
    toIncludePattern={toIncludePattern}
    texts={{
      label: Drupal.t('Parking zone', {}, { context: 'Vehicle removal search' }),
      searchLabel: Drupal.t('Write a parking zone', {}, { context: 'Vehicle removal search' }),
      searchPlaceholder: Drupal.t('For example, Kamppi', {}, { context: 'Vehicle removal search' }),
    }}
  />
);
