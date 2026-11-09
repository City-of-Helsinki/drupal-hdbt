import { describe, expect, test } from 'vitest';
import { getKarttaUrls, MAX_URL_LENGTH, parseMapUrl } from './KarttaUrl';

const polygon =
  'POLYGON ((25502827.48 6674216.21, 25503030.65 6674259.65, 25503034.83 6674240.09, 25502831.66 6674196.65, 25502827.48 6674216.21))';
const mapUrl = (e: number, n: number, wkt = polygon) =>
  `https://kartta.hel.fi/?e=${e}&n=${n}&r=2&l=Karttasarja&geom=${encodeURIComponent(wkt)}`;

describe('parseMapUrl', () => {
  test('parses centre and geometry', () => {
    expect(parseMapUrl(mapUrl(25502931, 6674228))).toEqual({ e: 25502931, n: 6674228, wkt: polygon });
  });

  test.each(['', 'not a url', 'https://kartta.hel.fi/?l=Karttasarja'])('returns null for %s', (url) => {
    expect(parseMapUrl(url)).toBeNull();
  });
});

describe('getKarttaUrls', () => {
  test('returns a plain map when there are no geometries', () => {
    const { embedUrl, url } = getKarttaUrls([], 'sv');
    expect(embedUrl).toBe('https://kartta.hel.fi/embed/?setlanguage=sv&l=Karttasarja');
    expect(url).toBe('https://kartta.hel.fi/?setlanguage=sv&l=Karttasarja');
  });

  test('combines geometries and centres the map on them', () => {
    const { embedUrl } = getKarttaUrls([mapUrl(25502931, 6674228), mapUrl(25503931, 6675228)], 'fi');
    const params = new URL(embedUrl).searchParams;

    expect(embedUrl).toContain('%20');
    expect(params.get('geom')?.split(';')).toEqual([polygon, polygon]);
    expect(params.get('e')).toBe('25503379');
    expect(params.get('n')).toBe('6674712');
    expect(Number(params.get('r'))).toBeGreaterThan(2);
  });

  test('falls back to points when the URL would be too long', () => {
    const urls = Array.from({ length: 60 }, (_, i) => mapUrl(25502931 + i, 6674228 + i));
    const { embedUrl } = getKarttaUrls(urls, 'fi');
    const geoms = new URL(embedUrl).searchParams.get('geom')?.split(';') ?? [];

    expect(embedUrl.length).toBeLessThanOrEqual(MAX_URL_LENGTH);
    expect(geoms).toHaveLength(60);
    expect(geoms[0]).toBe('POINT (25502931 6674228)');
  });
});
