import type { FilterFunction } from 'hds-react';
import { postalCodesAtom } from '../store';
import { TermFilter } from './TermFilter';

/**
 * Postal codes are matched from the start.
 */
const filter: FilterFunction = (option, filterStr) => option.label.startsWith(filterStr.trim());

export const PostalCodeFilter = () => (
  <TermFilter
    id='postal-codes'
    atom={postalCodesAtom}
    field='postal_codes'
    filter={filter}
    texts={{
      label: Drupal.t('Postal code', {}, { context: 'Vehicle removal search' }),
      filterLabel: Drupal.t('Write a postal code', {}, { context: 'Vehicle removal search' }),
      filterPlaceholder: Drupal.t('For example, 00100', {}, { context: 'Vehicle removal search' }),
    }}
  />
);
