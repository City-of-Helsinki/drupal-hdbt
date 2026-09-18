import { describe, expect, test, vi } from 'vitest';
import {
  fetchServiceMap,
  firstRejectionReason,
  getAddressCoordinates,
  ServiceMapUnavailableError,
  sanitizeAddress,
} from './ServiceMap';

const URL_UNDER_TEST = 'https://api.hel.fi/servicemap/v2/search/?q=Kotikatu';

const mockFetch = (impl: () => Promise<unknown>) => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation(impl));
};

describe('fetchServiceMap', () => {
  test('resolves the parsed response body', async () => {
    mockFetch(async () => ({ ok: true, status: 200, json: async () => ({ results: [{ id: 1 }] }) }));

    await expect(fetchServiceMap(URL_UNDER_TEST)).resolves.toEqual({ results: [{ id: 1 }] });
  });

  test('throws ServiceMapUnavailableError when the request fails', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch');
    });

    await expect(fetchServiceMap(URL_UNDER_TEST)).rejects.toBeInstanceOf(ServiceMapUnavailableError);
  });

  test('throws ServiceMapUnavailableError on a non-ok status', async () => {
    mockFetch(async () => ({ ok: false, status: 503, json: async () => ({}) }));

    await expect(fetchServiceMap(URL_UNDER_TEST)).rejects.toBeInstanceOf(ServiceMapUnavailableError);
  });

  test('throws ServiceMapUnavailableError when the body is not JSON', async () => {
    mockFetch(async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token <');
      },
    }));

    await expect(fetchServiceMap(URL_UNDER_TEST)).rejects.toBeInstanceOf(ServiceMapUnavailableError);
  });

  test('lets an abort bubble up untouched', async () => {
    mockFetch(async () => {
      throw new DOMException('The user aborted a request.', 'AbortError');
    });

    await expect(fetchServiceMap(URL_UNDER_TEST)).rejects.not.toBeInstanceOf(ServiceMapUnavailableError);
  });
});

describe('firstRejectionReason', () => {
  test('returns the first rejection reason', async () => {
    const settled = await Promise.allSettled([
      Promise.resolve('ok'),
      Promise.reject(new Error('first')),
      Promise.reject(new Error('second')),
    ]);

    expect((firstRejectionReason(settled) as Error).message).toBe('first');
  });

  test('returns undefined when nothing rejected', async () => {
    const settled = await Promise.allSettled([Promise.resolve('ok')]);

    expect(firstRejectionReason(settled)).toBeUndefined();
  });
});

describe('getAddressCoordinates', () => {
  const response = (results: unknown[]) => ({
    ok: true,
    status: 200,
    json: async () => ({ count: results.length, next: null, previous: null, results }),
  });

  const address = {
    location: { type: 'Point', coordinates: [24.93, 60.16] },
    name: { fi: 'Kotikatu 1', sv: 'Hemgatan 1', en: 'Kotikatu 1' },
  };

  test('returns null without querying when there is no address', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(getAddressCoordinates('')).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('resolves coordinates and the translated name', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([address])));

    await expect(getAddressCoordinates('Kotikatu 1')).resolves.toEqual([24.93, 60.16, 'Kotikatu 1']);
  });

  test('strips characters the api rejects before querying', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response([address]));
    vi.stubGlobal('fetch', fetchMock);

    await getAddressCoordinates('Kotikatu 1;');

    for (const [url] of fetchMock.mock.calls) {
      expect(new URL(url).searchParams.get('q')).toBe('Kotikatu 1');
    }
  });

  test('returns null without querying when nothing queryable survives sanitizing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(getAddressCoordinates(';;;')).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('returns null when the address is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([])));

    await expect(getAddressCoordinates('Ei ole olemassa 404')).resolves.toBeNull();
  });

  test('throws ServiceMapUnavailableError when every request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(getAddressCoordinates('Kotikatu 1')).rejects.toBeInstanceOf(ServiceMapUnavailableError);
  });

  test('still resolves when only one language request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce(response([address])),
    );

    await expect(getAddressCoordinates('Kotikatu 1')).resolves.toEqual([24.93, 60.16, 'Kotikatu 1']);
  });

  test('falls back to the language that actually matched', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(response([]))
        .mockResolvedValueOnce(response([address])),
    );

    await expect(getAddressCoordinates('Hemgatan 1')).resolves.toEqual([24.93, 60.16, 'Kotikatu 1']);
  });
});

describe('sanitizeAddress', () => {
  test.each([
    ['Kotikatu 1;', 'Kotikatu 1'],
    ['Kotikatu 1', 'Kotikatu 1'],
    ['Ääkköskatu 5 Ö', 'Ääkköskatu 5 Ö'],
    ['Topeliuksenkatu 1-3', 'Topeliuksenkatu 1-3'],
    ["O'Briens gränd", "O'Briens gränd"],
    ['Föreningsgatan 4 & 6', 'Föreningsgatan 4 & 6'],
    ['Étoile 2', 'Étoile 2'],
    ['<script>alert(1)</script>', 'scriptalert1script'],
    [';;;', ''],
  ])('sanitizes %j to %j', (input, expected) => {
    expect(sanitizeAddress(input)).toBe(expected);
  });
});
