import { describe, expect, test } from 'vitest';
import { formatTime } from './TimeHelpers';

describe('TimeHelpers', () => {
  describe('formatTime', () => {
    test('formats an afternoon time using the 24-hour fi-FI clock', () => {
      expect(formatTime(new Date(2025, 7, 5, 16, 0))).toBe('16.00');
    });

    test('zero-pads both hours and minutes', () => {
      expect(formatTime(new Date(2025, 7, 5, 9, 5))).toBe('09.05');
    });

    test('formats midnight as 00.00', () => {
      expect(formatTime(new Date(2025, 7, 5, 0, 0))).toBe('00.00');
    });

    test('drops seconds', () => {
      expect(formatTime(new Date(2025, 7, 5, 13, 45, 59))).toBe('13.45');
    });

    test('ignores the date part', () => {
      expect(formatTime(new Date(1999, 0, 1, 8, 30))).toBe(formatTime(new Date(2030, 11, 31, 8, 30)));
    });
  });
});
