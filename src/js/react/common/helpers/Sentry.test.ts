import * as Sentry from '@sentry/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import initSentry from './Sentry';

const send = vi.hoisted(() => vi.fn(async () => ({})));

// Run the real SDK with a fake transport.
vi.mock('@sentry/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@sentry/react')>();

  return {
    ...actual,
    init: (options: Sentry.BrowserOptions) =>
      actual.init({
        ...options,
        dsn: 'https://key@localhost/1',
        defaultIntegrations: false,
        integrations: [actual.eventFiltersIntegration()],
        transport: () => ({ send, flush: async () => true }),
      }),
  };
});

initSentry();

const pageUrl = 'https://localhost/search';
const bundleUrl = 'https://localhost/app.min.js';

const buildEvent = (type: string, filenames: string[]) => ({
  exception: {
    values: [
      {
        type,
        value: 'Maximum call stack size exceeded.',
        stacktrace: { frames: filenames.map((filename) => ({ filename })) },
      },
    ],
  },
});

const isSent = async (capture: () => void) => {
  capture();
  await Sentry.flush();

  return send.mock.calls.length > 0;
};

describe('Sentry', () => {
  beforeEach(() => {
    send.mockClear();
  });

  test.each([
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications.',
    'Non-Error promise rejection captured with value: undefined',
  ])('drops the ignored error "%s"', async (message) => {
    expect(await isSent(() => Sentry.captureException(new Error(message)))).toBe(false);
  });

  test('sends an error that is not ignored', async () => {
    expect(await isSent(() => Sentry.captureException(new Error('Elasticsearch is down')))).toBe(true);
  });

  test('drops a stack overflow thrown by a browser-injected script', async () => {
    expect(await isSent(() => Sentry.captureEvent(buildEvent('RangeError', [pageUrl, pageUrl])))).toBe(false);
  });

  test('sends a stack overflow thrown by a script file', async () => {
    expect(await isSent(() => Sentry.captureEvent(buildEvent('RangeError', [pageUrl, bundleUrl])))).toBe(true);
  });

  test('sends a stack overflow without frames', async () => {
    expect(await isSent(() => Sentry.captureEvent(buildEvent('RangeError', [])))).toBe(true);
  });

  test('sends other errors thrown by a browser-injected script', async () => {
    expect(await isSent(() => Sentry.captureEvent(buildEvent('TypeError', [pageUrl])))).toBe(true);
  });
});
