import { postalCodesAtom } from '../store';
import { TermFilter } from './TermFilter';

/**
 * Postal codes are numeric, so anything else is stripped and the code is matched from the start.
 */
const toIncludePattern = (searchTerm: string): string => {
  const term = searchTerm.replace(/\D/g, '');

  return term ? `${term}.*` : '';
};

export const PostalCodeFilter = () => (
  <TermFilter
    id='postal-codes'
    atom={postalCodesAtom}
    field='postal_codes'
    toIncludePattern={toIncludePattern}
    texts={{
      label: Drupal.t('Postal code', {}, { context: 'Vehicle removal search' }),
      searchLabel: Drupal.t('Write a postal code', {}, { context: 'Vehicle removal search' }),
      searchPlaceholder: Drupal.t('For example, 00100', {}, { context: 'Vehicle removal search' }),
    }}
  />
);
