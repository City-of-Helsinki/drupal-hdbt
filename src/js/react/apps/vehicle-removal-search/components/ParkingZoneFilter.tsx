import { defaultFilter } from 'hds-react';
import { parkingZonesAtom } from '../store';
import { TermFilter } from './TermFilter';

/**
 * HDS's default case-insensitive "contains" matching is used for parking zone names.
 */
export const ParkingZoneFilter = () => (
  <TermFilter
    id='parking-zones'
    atom={parkingZonesAtom}
    values={drupalSettings.helfi_react_search?.resident_parking_zones ?? []}
    filter={defaultFilter}
    texts={{
      label: Drupal.t('Parking zone', {}, { context: 'Vehicle removal search' }),
      filterLabel: Drupal.t('Write a parking zone', {}, { context: 'Vehicle removal search' }),
      filterPlaceholder: Drupal.t('For example, Kamppi', {}, { context: 'Vehicle removal search' }),
    }}
  />
);
