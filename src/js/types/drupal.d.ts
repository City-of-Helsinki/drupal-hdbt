declare namespace Drupal {
  const cookieConsent: any;
  function t(str: string, options?: object, context?: object);
  function formatPlural(count: string, singular: string, plural: string, args?: object, options?: object)
  function theme(id: string);
}
