const { currentLanguage } = window.drupalSettings.path;

export const getDefaultSelectTexts = (label: string) => ({
  clearButtonAriaLabel_one: Drupal.t(
    'Clear @label selection',
    { '@label': label },
    { context: 'React search clear selection label' },
  ),
  clearButtonAriaLabel_multiple: Drupal.t(
    'Clear @label selection',
    { '@label': label },
    { context: 'React search clear selection label' },
  ),
  label,
  language: currentLanguage,
});
