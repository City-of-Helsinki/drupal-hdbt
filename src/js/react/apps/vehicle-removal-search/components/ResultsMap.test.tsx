import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { SWRConfig } from 'swr';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { getNoticeNumber } from '../hooks/useMapResults';
import { submittedStateAtom } from '../store';
import ResultsMap from './ResultsMap';

const mapUrl = (i: number) =>
  `https://kartta.hel.fi/?e=${25496000 + i * 10}&n=${6672000 + i * 10}&r=2&l=Karttasarja%2CAjoneuvojen_siirtokehotukset&w=%2Anro%3D%3D${70000 + i}`;

type Hit = { _id: string; _source: { notice_number?: number; map_url: string } };

const hit = (i: number, withNumber = true): Hit => ({
  _id: `mobilenote_data_source/ppoytakirjaExtranet.${70000 + i}`,
  _source: { ...(withNumber ? { notice_number: 70000 + i } : {}), map_url: mapUrl(i) },
});

const mockFetch = (hits: Hit[], total = hits.length) => {
  const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => ({
    json: async () => ({ hits: { total: { value: total, relation: 'eq' }, hits } }),
  }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

const option = (value: string) => ({
  value,
  label: value,
  selected: true,
  isGroupLabel: false,
  visible: true,
  disabled: false,
});

const renderMap = ({ withFilters = false } = {}) => {
  const store = createStore();
  if (withFilters) {
    store.set(submittedStateAtom, { postalCodes: [option('00100')] });
  }

  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <Provider store={store}>
        <ResultsMap />
      </Provider>
    </SWRConfig>,
  );
};

const allNoticesNotice = () => screen.queryByText('The map shows all vehicle removal requests');

// The iframe needs a measured size, which jsdom does not have, so the
// full-page map link is checked instead. It has the same filter.
const mapLinkFilter = async () => {
  const link = await screen.findByRole('link', { name: /Open large version of the map/ });
  return new URL(link.getAttribute('href') ?? '').searchParams.get('w');
};

const originalFetch = globalThis.fetch;

describe('ResultsMap', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('fetches the notice numbers of all results of the search, not just one page', async () => {
    const fetchMock = mockFetch([hit(1), hit(2)]);
    renderMap();

    await mapLinkFilter();
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1].body));

    expect(body.from).toBe(0);
    expect(body.size).toBeGreaterThan(30);
    expect(body._source).toEqual(['notice_number', 'map_url']);
  });

  test('filters the notice layer to the results', async () => {
    mockFetch([hit(1), hit(2)]);
    renderMap();

    expect(await mapLinkFilter()).toBe('*(nro==70001)||(nro==70002)');
  });

  test('shows all notices when not all results could be fetched', async () => {
    mockFetch([hit(1), hit(2)], 900);
    renderMap();

    expect(await mapLinkFilter()).toBeNull();
  });

  test('explains when a filtered search shows all notices on the map', async () => {
    mockFetch([hit(1), hit(2)], 900);
    renderMap({ withFilters: true });

    expect(await mapLinkFilter()).toBeNull();
    expect(allNoticesNotice()).not.toBeNull();
  });

  test('needs no explanation for all notices when the search has no filters', async () => {
    mockFetch([hit(1), hit(2)], 900);
    renderMap();

    await mapLinkFilter();
    expect(allNoticesNotice()).toBeNull();
  });

  test('needs no explanation when the map shows only the results', async () => {
    mockFetch([hit(1), hit(2)]);
    renderMap({ withFilters: true });

    expect(await mapLinkFilter()).not.toBeNull();
    expect(allNoticesNotice()).toBeNull();
  });
});

describe('getNoticeNumber', () => {
  test('uses the indexed notice number', () => {
    expect(getNoticeNumber({ _index: 'i', _id: 'x.1', _source: { notice_number: 73567, map_url: '' } })).toBe(73567);
  });

  test('handles numbers returned as arrays', () => {
    // biome-ignore lint/suspicious/noExplicitAny: the index may return arrays for single values.
    expect(getNoticeNumber({ _index: 'i', _id: 'x.1', _source: { notice_number: [73567] as any, map_url: '' } })).toBe(
      73567,
    );
  });

  test('returns null when the number is not indexed', () => {
    expect(getNoticeNumber({ _index: 'i', ...hit(5, false) })).toBeNull();
  });
});
