import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';

const KARTTA_BASE_URL = 'https://kartta.hel.fi/';

// The base map and the kartta.hel.fi layer of vehicle removal notices. The
// layer shows the same MobileNote notices that are indexed for the search.
const LAYERS = 'Karttasarja,Ajoneuvojen_siirtokehotukset';

// kartta.hel.fi answers 414 somewhere between 8k and 12k characters.
export const MAX_URL_LENGTH = 7500;

// Fallback viewport in pixels, used to fit all results into view when the
// size of the map is unknown (for example the full-page map link).
const DEFAULT_VIEWPORT: Viewport = { width: 700, height: 360 };
const MIN_RESOLUTION = 1;
const PADDING_FACTOR = 1.3;
// The bounds are calculated from the centre points of the notices, so leave
// room around them for the notices themselves.
const MIN_SPAN_METRES = 400;

export type Viewport = {
  width: number;
  height: number;
};

export type MapResult = {
  // Notice number, the same on the kartta.hel.fi layer.
  nro: number;
  // kartta.hel.fi link to the notice, from the index.
  mapUrl: string;
};

type Centre = {
  e: number;
  n: number;
};

/**
 * Parses the centre point out of a pre-built kartta.hel.fi link.
 *
 * Links look like: https://kartta.hel.fi/?e=25502931&n=6674228&r=2&l=...
 */
export const parseCentre = (mapUrl: string): Centre | null => {
  if (!mapUrl) return null;

  let url: URL;
  try {
    url = new URL(mapUrl);
  } catch {
    return null;
  }

  const e = Number(url.searchParams.get('e'));
  const n = Number(url.searchParams.get('n'));

  if (!Number.isFinite(e) || !Number.isFinite(n) || !e || !n) return null;

  return { e, n };
};

/**
 * Builds a kartta.hel.fi filter that matches the given notice numbers.
 *
 * kartta.hel.fi fails on "nro in (...)", and its filter parser fails on a flat
 * chain of 64 or more "||" comparisons. A balanced tree of comparisons keeps
 * the nesting shallow, so any number of notices works.
 */
export const buildNoticeFilter = (nros: number[]): string => {
  if (nros.length === 1) return `nro==${nros[0]}`;

  const middle = Math.floor(nros.length / 2);
  return `(${buildNoticeFilter(nros.slice(0, middle))})||(${buildNoticeFilter(nros.slice(middle))})`;
};

const buildUrl = (base: string, params: Record<string, string>) => {
  // kartta.hel.fi requires %20 for spaces, which URLSearchParams would encode as "+".
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${base}?${query}`;
};

/**
 * Adds the current language to a kartta.hel.fi link.
 */
export const withLanguage = (mapUrl: string, lang?: string): string => {
  try {
    const url = new URL(mapUrl);
    if (url.hostname !== new URL(KARTTA_BASE_URL).hostname) return mapUrl;

    const separator = url.search ? '&' : '?';
    return `${url.origin}${url.pathname}${url.search}${separator}setlanguage=${getCurrentLanguage(lang)}${url.hash}`;
  } catch {
    return mapUrl;
  }
};

type KarttaUrls = {
  embedUrl: string;
  url: string;
  // Whether the map shows only the given results. When there are too many to
  // fit into the URL, the map shows all notices on the layer instead.
  filtered: boolean;
};

/**
 * Builds kartta.hel.fi URLs that show the given results on the notice layer.
 *
 * @param results - The results to show.
 * @param lang - The current language.
 * @param viewport - Size of the embedded map, used to fit the results into view.
 * @param complete - Whether the results are all results of the search. If not,
 *   the map shows all notices instead, so that none of the results is missing.
 */
export const getKarttaUrls = (
  results: MapResult[],
  lang?: string,
  viewport: Viewport = DEFAULT_VIEWPORT,
  complete = true,
): KarttaUrls => {
  const centres = results.map(({ mapUrl }) => parseCentre(mapUrl)).filter((c): c is Centre => c !== null);
  const nros = [...new Set(results.map(({ nro }) => nro))];

  const params: Record<string, string> = { setlanguage: getCurrentLanguage(lang), l: LAYERS };

  const build = (resolutionFor: (viewport: Viewport) => number | null, filter?: string) => {
    const paramsFor = (size: Viewport): Record<string, string> => {
      const resolution = resolutionFor(size);
      return {
        ...params,
        ...(resolution ? { r: String(resolution) } : {}),
        // The "w" parameter has a filter for each layer in "l", separated by
        // "*". The base map is not filtered.
        ...(filter ? { w: `*${filter}` } : {}),
      };
    };

    return {
      embedUrl: buildUrl(`${KARTTA_BASE_URL}embed/`, paramsFor(viewport)),
      url: buildUrl(KARTTA_BASE_URL, paramsFor(DEFAULT_VIEWPORT)),
    };
  };

  let resolutionFor: (viewport: Viewport) => number | null = () => null;

  if (centres.length) {
    const minE = Math.min(...centres.map(({ e }) => e));
    const maxE = Math.max(...centres.map(({ e }) => e));
    const minN = Math.min(...centres.map(({ n }) => n));
    const maxN = Math.max(...centres.map(({ n }) => n));
    const spanE = Math.max(maxE - minE, MIN_SPAN_METRES);
    const spanN = Math.max(maxN - minN, MIN_SPAN_METRES);

    params.e = String(Math.round((minE + maxE) / 2));
    params.n = String(Math.round((minN + maxN) / 2));

    // Metres per pixel needed to fit the bounds into the given viewport.
    resolutionFor = ({ width, height }: Viewport) =>
      Math.max(
        MIN_RESOLUTION,
        Math.ceil(Math.max(spanE / Math.max(width, 1), spanN / Math.max(height, 1)) * PADDING_FACTOR),
      );
  }

  if (complete && nros.length) {
    const filtered = build(resolutionFor, buildNoticeFilter(nros));
    if (Math.max(filtered.embedUrl.length, filtered.url.length) <= MAX_URL_LENGTH) {
      return { ...filtered, filtered: true };
    }
  }

  // Too many results for the URL: show all notices, like the school search
  // shows all schools when there are too many results.
  return { ...build(resolutionFor), filtered: false };
};
