import { describe, expect, test } from 'vitest';
import {
  buildNoticeFilter,
  getKarttaUrls,
  MAX_URL_LENGTH,
  type MapResult,
  parseCentre,
  withLanguage,
} from './KarttaUrl';

const mapUrl = (e: number, n: number, nro = 1) =>
  `https://kartta.hel.fi/?e=${e}&n=${n}&r=2&l=Karttasarja%2CAjoneuvojen_siirtokehotukset&w=%2Anro%3D%3D${nro}`;
const result = (nro: number, e = 25502931, n = 6674228): MapResult => ({ nro, mapUrl: mapUrl(e, n, nro) });

const params = (url: string) => new URL(url).searchParams;

// Nesting depth of the parentheses in a filter.
const depth = (filter: string) =>
  [...filter].reduce(
    ({ current, max }, char) => {
      const next = current + (char === '(' ? 1 : char === ')' ? -1 : 0);
      return { current: next, max: Math.max(max, next) };
    },
    { current: 0, max: 0 },
  ).max;

describe('parseCentre', () => {
  test('parses the centre point', () => {
    expect(parseCentre(mapUrl(25502931, 6674228))).toEqual({ e: 25502931, n: 6674228 });
  });

  test.each(['', 'not a url', 'https://kartta.hel.fi/?l=Karttasarja'])('returns null for %s', (url) => {
    expect(parseCentre(url)).toBeNull();
  });
});

describe('buildNoticeFilter', () => {
  test('matches a single notice', () => {
    expect(buildNoticeFilter([73567])).toBe('nro==73567');
  });

  test('combines notices with "||"', () => {
    expect(buildNoticeFilter([1, 2])).toBe('(nro==1)||(nro==2)');
    expect(buildNoticeFilter([1, 2, 3])).toBe('(nro==1)||((nro==2)||(nro==3))');
  });

  test('keeps the nesting shallow, since kartta.hel.fi fails on 64 levels', () => {
    const nros = Array.from({ length: 300 }, (_, i) => 70000 + i);
    const filter = buildNoticeFilter(nros);

    expect(depth(filter)).toBeLessThanOrEqual(Math.ceil(Math.log2(300)));
    expect(filter.match(/nro==\d+/g)).toHaveLength(300);
  });
});

describe('withLanguage', () => {
  test('adds the language to a kartta.hel.fi link', () => {
    expect(withLanguage(mapUrl(25502931, 6674228, 5), 'sv')).toBe(`${mapUrl(25502931, 6674228, 5)}&setlanguage=sv`);
  });

  test.each(['', 'not a url', 'https://example.com/?a=1'])('leaves %s as it is', (url) => {
    expect(withLanguage(url, 'sv')).toBe(url);
  });
});

describe('getKarttaUrls', () => {
  test('shows the notice layer filtered to the results', () => {
    const { embedUrl, url, filtered } = getKarttaUrls([result(73567), result(73410, 25503931, 6675228)], 'fi');

    expect(filtered).toBe(true);
    expect(embedUrl.startsWith('https://kartta.hel.fi/embed/?')).toBe(true);
    expect(url.startsWith('https://kartta.hel.fi/?')).toBe(true);
    expect(params(embedUrl).get('l')).toBe('Karttasarja,Ajoneuvojen_siirtokehotukset');
    // No filter for the base map, then the filter for the notice layer.
    expect(params(embedUrl).get('w')).toBe('*(nro==73567)||(nro==73410)');
    expect(params(url).get('w')).toBe('*(nro==73567)||(nro==73410)');
    expect(params(embedUrl).get('setlanguage')).toBe('fi');
  });

  test('centres the map on the results', () => {
    const { embedUrl } = getKarttaUrls([result(1, 25502931, 6674228), result(2, 25503931, 6675228)], 'fi');

    expect(params(embedUrl).get('e')).toBe('25503431');
    expect(params(embedUrl).get('n')).toBe('6674728');
  });

  test('does not zoom in all the way on a single result', () => {
    const { embedUrl } = getKarttaUrls([result(1)], 'fi', { width: 700, height: 364 });

    // At least 400 m of the map around the notice is visible.
    expect(Number(params(embedUrl).get('r')) * 364).toBeGreaterThanOrEqual(400);
  });

  test('zooms out for a narrow map so all results stay in view', () => {
    // Two results 1000 m apart horizontally.
    const results = [result(1, 25502000, 6674228), result(2, 25503000, 6674228)];
    const resolution = (width: number) =>
      Number(params(getKarttaUrls(results, 'fi', { width, height: width * 0.52 }).embedUrl).get('r'));

    expect(resolution(700)).toBeLessThan(resolution(320));
    expect(resolution(320) * 320).toBeGreaterThanOrEqual(1000);
  });

  test('uses the default viewport for the full-page map link', () => {
    const results = [result(1, 25502931, 6674228), result(2, 25503931, 6675228)];
    const narrow = getKarttaUrls(results, 'fi', { width: 320, height: 166 });
    const wide = getKarttaUrls(results, 'fi');

    expect(narrow.embedUrl).not.toBe(wide.embedUrl);
    expect(narrow.url).toBe(wide.url);
  });

  test('filters up to about 300 results', () => {
    const results = Array.from({ length: 280 }, (_, i) => result(70000 + i));
    const { embedUrl, url, filtered } = getKarttaUrls(results, 'fi');

    expect(filtered).toBe(true);
    expect(embedUrl.length).toBeLessThanOrEqual(MAX_URL_LENGTH);
    expect(url.length).toBeLessThanOrEqual(MAX_URL_LENGTH);
  });

  test('shows all notices when the results do not fit into the URL', () => {
    const results = Array.from({ length: 400 }, (_, i) => result(70000 + i));
    const { embedUrl, url, filtered } = getKarttaUrls(results, 'fi');

    expect(filtered).toBe(false);
    expect(params(embedUrl).has('w')).toBe(false);
    expect(params(url).has('w')).toBe(false);
    expect(params(embedUrl).get('l')).toBe('Karttasarja,Ajoneuvojen_siirtokehotukset');
  });

  test('shows all notices when not all results were fetched', () => {
    const { embedUrl, filtered } = getKarttaUrls([result(1), result(2)], 'fi', undefined, false);

    expect(filtered).toBe(false);
    expect(params(embedUrl).has('w')).toBe(false);
  });

  test('lists each notice once', () => {
    const { embedUrl } = getKarttaUrls([result(5), result(5)], 'fi');

    expect(params(embedUrl).get('w')).toBe('*nro==5');
  });
});
