import * as Sentry from '@sentry/react';

export const sentryEnabled = () => !!drupalSettings?.raven?.options?.dsn;

const initSentry = () => {
  Sentry.init({
    // Use same settings for React and JS tracking. If the DSN value is not
    // provided, the SDK will just not send any events. If you need to test
    // Sentry locally, check SENTRY_DSN_PUBLIC test environment value from
    // Azure.
    ...drupalSettings.raven.options,
    // Suppress the ResizeObserver loop limit exceeded error.
    ignoreErrors: ['ResizeObserver loop limit exceeded']
  });
};

export default initSentry;

