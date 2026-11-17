import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';

const KARTTA_BASE_URL = 'https://kartta.hel.fi/';

// kartta.hel.fi answers 414 somewhere between 8k and 12k characters.
export const MAX_URL_LENGTH = 7500;

// Fallback viewport in pixels, used to fit all results into view when the
// size of the map is unknown (for example the full-page map link).
const DEFAULT_VIEWPORT: Viewport = { width: 700, height: 360 };
const MIN_RESOLUTION = 1;
const PADDING_FACTOR = 1.3;

export type Viewport = {
  width: number;
  height: number;
};

type Feature = {
  e: number;
  n: number;
  wkt: string;
};

/**
 * Parses the centre point and WKT geometry out of a pre-built kartta.hel.fi link.
 *
 * Links look like: https://kartta.hel.fi/?e=25502931&n=6674228&r=2&l=Karttasarja&geom=POLYGON%20((...))
 */
export const parseMapUrl = (mapUrl: string): Feature | null => {
  if (!mapUrl) return null;

  let url: URL;
  try {
    url = new URL(mapUrl);
  } catch {
    return null;
  }

  const e = Number(url.searchParams.get('e'));
  const n = Number(url.searchParams.get('n'));
  const wkt = url.searchParams.get('geom')?.trim() ?? '';

  if (!Number.isFinite(e) || !Number.isFinite(n) || !e || !n) return null;

  return { e, n, wkt };
};

/**
 * Returns the bounding box of all coordinate pairs found in the WKT strings.
 */
const getBounds = (features: Feature[]) => {
  let minE = Infinity;
  let minN = Infinity;
  let maxE = -Infinity;
  let maxN = -Infinity;

  const extend = (e: number, n: number) => {
    minE = Math.min(minE, e);
    minN = Math.min(minN, n);
    maxE = Math.max(maxE, e);
    maxN = Math.max(maxN, n);
  };

  features.forEach(({ e, n, wkt }) => {
    extend(e, n);
    for (const [, x, y] of wkt.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)) {
      extend(Number(x), Number(y));
    }
  });

  return { minE, minN, maxE, maxN };
};

const buildUrl = (base: string, params: Record<string, string>) => {
  // kartta.hel.fi requires %20 for spaces, which URLSearchParams would encode as "+".
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${base}?${query}`;
};

type KarttaUrls = {
  embedUrl: string;
  url: string;
  // How many of the given results are drawn on the map.
  shown: number;
  // Whether some of the results were left out because the URL got too long.
  truncated: boolean;
};

/**
 * Builds kartta.hel.fi URLs that show the given results on the map.
 *
 * All geometries are passed in the `geom` parameter separated by semicolons.
 * If the full geometries would make the URL too long, every result is drawn
 * as a point at its centre instead. If even the points do not fit, only the
 * first results that fit are drawn, and `shown` tells how many.
 */
export const getKarttaUrls = (mapUrls: string[], lang?: string, viewport: Viewport = DEFAULT_VIEWPORT): KarttaUrls => {
  const language = getCurrentLanguage(lang);
  const features = mapUrls.map(parseMapUrl).filter((feature): feature is Feature => feature !== null);

  if (!features.length) {
    const params = { setlanguage: language, l: 'Karttasarja' };
    return {
      embedUrl: buildUrl(`${KARTTA_BASE_URL}embed/`, params),
      url: buildUrl(KARTTA_BASE_URL, params),
      shown: 0,
      truncated: false,
    };
  }

  const build = (shownFeatures: Feature[], asPoints: boolean): KarttaUrls => {
    const { minE, minN, maxE, maxN } = getBounds(shownFeatures);

    // Metres per pixel needed to fit the bounds into the given viewport.
    const getResolution = ({ width, height }: Viewport) =>
      Math.max(
        MIN_RESOLUTION,
        Math.ceil(Math.max((maxE - minE) / Math.max(width, 1), (maxN - minN) / Math.max(height, 1)) * PADDING_FACTOR),
      );

    const geom = shownFeatures.map(({ e, n, wkt }) => (asPoints || !wkt ? `POINT (${e} ${n})` : wkt)).join(';');

    const params = (resolution: number) => ({
      setlanguage: language,
      e: String(Math.round((minE + maxE) / 2)),
      n: String(Math.round((minN + maxN) / 2)),
      r: String(resolution),
      l: 'Karttasarja',
      geom,
    });

    return {
      embedUrl: buildUrl(`${KARTTA_BASE_URL}embed/`, params(getResolution(viewport))),
      url: buildUrl(KARTTA_BASE_URL, params(getResolution(DEFAULT_VIEWPORT))),
      shown: shownFeatures.length,
      truncated: shownFeatures.length < features.length,
    };
  };

  const fits = ({ embedUrl, url }: KarttaUrls) => Math.max(embedUrl.length, url.length) <= MAX_URL_LENGTH;

  const full = build(features, false);
  if (fits(full)) return full;

  // Find the largest number of results that fit as points. The results are in
  // relevance order, so the most relevant ones are kept.
  let low = 1;
  let high = features.length;
  let best = build(features.slice(0, 1), true);

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = build(features.slice(0, middle), true);

    if (fits(candidate)) {
      best = candidate;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return best;
};
