export type AddressSearchErrorType = 'not-found' | 'unavailable';

export const resolveAddressSearchError = (error?: boolean | AddressSearchErrorType): AddressSearchErrorType | null => {
  if (!error) {
    return null;
  }

  return error === true ? 'not-found' : error;
};

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
