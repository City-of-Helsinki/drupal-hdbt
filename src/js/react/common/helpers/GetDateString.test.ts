import { describe, expect, test } from 'vitest';
import { getDateString } from './GetDateString';

// Exercises the global Drupal.t stub (setupTests.ts) and the "@/types" path
// alias resolved by vite-tsconfig-paths.
describe('getDateString', () => {
  const start = new Date(2024, 2, 5); // 5.3.2024
  const end = new Date(2024, 2, 9); // 9.3.2024

  test('returns "All dates" when no dates are given', () => {
    expect(getDateString({ startDate: undefined, endDate: undefined })).toBe('All dates');
  });

  test('returns the start date when only a start date is given', () => {
    expect(getDateString({ startDate: start, endDate: undefined })).toBe('5.3.2024');
  });

  test('returns the end date prefixed with a dash when only an end date is given', () => {
    expect(getDateString({ startDate: undefined, endDate: end })).toBe('- 9.3.2024');
  });

  test('returns a range when both dates are given', () => {
    expect(getDateString({ startDate: start, endDate: end })).toBe('5.3.2024 - 9.3.2024');
  });

  test('interpolates placeholders when showLabels is set', () => {
    expect(getDateString({ startDate: start, endDate: undefined, showLabels: true })).toBe('From 5.3.2024');
  });
});
