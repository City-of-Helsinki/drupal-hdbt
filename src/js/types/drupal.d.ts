declare namespace Drupal {
  const cookieConsent: {
    initialized: () => boolean;
    loadFunction: (callback: () => void) => void;
    getConsentStatus: (categories: string[]) => string;
    setAcceptedCategories: (categories: string[]) => void;
  };
  function t(str: string, options?: object, context?: object);
  function formatPlural(
    count: string,
    singular: string,
    plural: string,
    args?: object,
    options?: object,
  );
  function theme(id: string);
}
