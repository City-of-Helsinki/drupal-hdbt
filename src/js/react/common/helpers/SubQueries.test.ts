import { describe, expect, test } from 'vitest';
import { getAddressUrls } from './SubQueries';

describe('getAddressUrls', () => {
  test('strips characters the api rejects', () => {
    const urls = getAddressUrls('Kotikatu 1;');

    expect(urls).toHaveLength(2);

    for (const url of urls) {
      expect(new URL(url).searchParams.get('q')).toBe('Kotikatu 1');
    }
  });

  test('returns no urls when nothing queryable survives sanitizing', () => {
    expect(getAddressUrls(';;;')).toEqual([]);
  });
});
