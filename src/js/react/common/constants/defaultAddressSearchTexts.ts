export const defaultAddressSearchTexts = {
  assistive: Drupal.t('Enter the street name and house number', {}, { context: 'React search: street input helper' }),
  label: Drupal.t('Home address', {}, { context: 'React search: home address' }),
  language: window.drupalSettings?.path?.currentLanguage || 'fi',
  searchPlaceholder: Drupal.t(
    'For example, Kotikatu 1',
    {},
    { context: 'React search: street input helper placeholder' },
  ),
};
