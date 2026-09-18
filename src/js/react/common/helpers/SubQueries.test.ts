import { describe, expect, test, vi } from 'vitest';
import { ServiceMapUnavailableError } from './ServiceMap';
import { getAddresses, getAddressUrls } from './SubQueries';

const response = (results: unknown[]) => ({
  ok: true,
  status: 200,
  json: async () => ({ count: results.length, next: null, previous: null, results }),
});

describe('getAddresses', () => {
  test('throws ServiceMapUnavailableError when every language request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(getAddresses(getAddressUrls('Kotikatu 1'))).rejects.toBeInstanceOf(ServiceMapUnavailableError);
  });

  test('keeps going when only one language request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce(response([{ name: { fi: 'Kotikatu 1' } }])),
    );

    const addresses = await getAddresses(getAddressUrls('Kotikatu 1'));

    expect(addresses).toHaveLength(1);
    expect(addresses[0].results).toHaveLength(1);
  });

  test('returns an empty result set when the address is simply unknown', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([])));

    const addresses = await getAddresses(getAddressUrls('Ei ole olemassa 404'));

    expect(addresses).toHaveLength(2);
    expect(addresses.every((address) => address.results.length === 0)).toBe(true);
  });
});

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

describe('getAddresses with no urls', () => {
  test('resolves empty instead of reporting an outage', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(getAddresses([])).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
