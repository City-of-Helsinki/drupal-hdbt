import { describe, expect, test, vi } from 'vitest';
import { getAddressCoordinates, sanitizeAddress } from './ServiceMap';

const response = (results: unknown[]) => ({
  ok: true,
  status: 200,
  json: async () => ({ count: results.length, next: null, previous: null, results }),
});

const address = {
  location: { type: 'Point', coordinates: [24.93, 60.16] },
  name: { fi: 'Kotikatu 1', sv: 'Hemgatan 1', en: 'Kotikatu 1' },
};

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

describe('getAddressCoordinates', () => {
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

  test('returns null when the address is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([])));

    await expect(getAddressCoordinates('Ei ole olemassa 404')).resolves.toBeNull();
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
});
