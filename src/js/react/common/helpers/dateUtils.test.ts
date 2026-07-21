import { describe, expect, test } from 'vitest';
import { formatHDSDate, parseHDSDate } from './dateUtils';

describe('dateUtils', () => {
  describe('parseHDSDate', () => {
    test('parses a valid d.m.yyyy string', () => {
      const date = parseHDSDate('5.3.2024');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(2);
      expect(date?.getDate()).toBe(5);
    });

    test('returns null for malformed input', () => {
      expect(parseHDSDate('2024-03-05')).toBeNull();
      expect(parseHDSDate('5.3')).toBeNull();
      expect(parseHDSDate('not a date')).toBeNull();
    });

    test('returns null for impossible calendar dates', () => {
      expect(parseHDSDate('31.2.2024')).toBeNull();
    });
  });

  describe('formatHDSDate', () => {
    test('formats a Date as d.m.yyyy', () => {
      expect(formatHDSDate(new Date(2024, 2, 5))).toBe('5.3.2024');
    });

    test('round-trips with parseHDSDate', () => {
      const input = '9.12.2023';
      const parsed = parseHDSDate(input);
      expect(parsed).not.toBeNull();
      expect(formatHDSDate(parsed as Date)).toBe(input);
    });
  });
});
