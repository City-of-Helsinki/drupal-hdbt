import { vi } from 'vitest';

// Interpolate Drupal.t placeholders (e.g. "@date") with the provided args.
const interpolate = (template: string, args?: Record<string, string | number>) => {
  if (!args) {
    return template;
  }
  return Object.entries(args).reduce((acc, [key, value]) => acc.replaceAll(key, String(value)), template);
};

// Stub the global Drupal.t used throughout the React components.
// Signature mirrors src/js/types/drupal.d.ts: t(str, options?, context?).
const Drupal = {
  t: (key: string, args?: Record<string, string | number>, _context?: object) => interpolate(key, args),
};
vi.stubGlobal('Drupal', Drupal);

// Minimal drupalSettings the React apps read from.
const drupalSettings = {
  path: { currentLanguage: 'en' },
  helfi_react_search: {
    sentry_dsn_react: '',
    elastic_proxy_url: '',
  },
};
vi.stubGlobal('drupalSettings', drupalSettings);

// HDS produces css parsing errors with jsdom. We don't really care about these.
console.error = (_message, ..._optionalParams) => {};

window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
