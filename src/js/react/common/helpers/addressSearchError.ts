/**
 * Why an address could not be turned into coordinates.
 *
 * - `not-found`: the service map answered, but knows no such address. The user
 *   can fix this by correcting what they typed.
 * - `unavailable`: the service map could not be reached. Nothing is wrong with
 *   the address and telling the user to check their spelling is misleading.
 */
export type AddressSearchErrorType = 'not-found' | 'unavailable';

/**
 * Normalises the AddressSearch `error` prop.
 *
 * `true` kept its original meaning so existing call sites do not change.
 *
 * @param {boolean|AddressSearchErrorType|undefined} error The prop value.
 *
 * @return {AddressSearchErrorType|null} The error type, or null when there is none.
 */
export const resolveAddressSearchError = (error?: boolean | AddressSearchErrorType): AddressSearchErrorType | null => {
  if (!error) {
    return null;
  }

  return error === true ? 'not-found' : error;
};

/**
 * The message shown next to the address input.
 *
 * @param {AddressSearchErrorType} type The error type.
 *
 * @return {string} The translated message.
 */
export const getAddressSearchInlineText = (type: AddressSearchErrorType): string =>
  type === 'unavailable'
    ? Drupal.t(
        'The address search is temporarily unavailable. Please try again later.',
        {},
        { context: 'Address search error message' },
      )
    : Drupal.t(
        'Make sure the address is correct. You can also try searching with a nearby address. The search suggests addresses as you type.',
        {},
        { context: 'Address search error message' },
      );

/**
 * The heading and hint shown in place of results.
 *
 * @param {AddressSearchErrorType} type The error type.
 *
 * @return {Object} The translated title and hint.
 */
export const getAddressSearchResultsText = (type: AddressSearchErrorType): { title: string; hint: string } =>
  type === 'unavailable'
    ? {
        title: Drupal.t(
          'The address search is temporarily unavailable',
          {},
          { context: 'React search: Address search unavailable title' },
        ),
        hint: Drupal.t(
          'We could not reach the address search, so results could not be listed for your address. Please try again later.',
          {},
          { context: 'React search: Address search unavailable hint' },
        ),
      }
    : {
        title: Drupal.t('No results for the address entered', {}, { context: 'React search: Address not found title' }),
        hint: Drupal.t(
          'Make sure the address is written correctly. You can also search using a nearby street number.',
          {},
          { context: 'React search: Address not found hint' },
        ),
      };
