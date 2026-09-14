import { describe, expect, test } from 'vitest';
import { getEmptyResultText, getOptionalResultText, getResultText, getStatusText } from './ResultText';

describe('ResultText', () => {
  test('counts open positions and job listings', () => {
    expect(getResultText(1)).toBe('1 open position');
    expect(getResultText(12)).toBe('12 open positions');
    expect(getOptionalResultText(1)).toBe('1 job listing');
    expect(getOptionalResultText(10)).toBe('10 job listings');
  });

  test('announces both counts of a search that found something', () => {
    expect(getStatusText(12, 10)).toBe('12 open positions, 10 job listings');
  });

  test('announces an empty search', () => {
    expect(getStatusText(0, 0)).toBe(getEmptyResultText());
  });

  test('announces a failed search', () => {
    expect(getStatusText(0, 0, new Error('Elasticsearch is down'))).toBe('An error occurred while loading the content');
  });

  test('reports the error over a stale count', () => {
    expect(getStatusText(12, 10, 'error')).toBe('An error occurred while loading the content');
  });
});
