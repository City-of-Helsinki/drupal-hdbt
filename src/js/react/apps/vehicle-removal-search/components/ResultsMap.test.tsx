import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { SWRConfig } from 'swr';
import { afterEach, describe, expect, test, vi } from 'vitest';
import ResultsMap from './ResultsMap';

const mapUrl = (i: number) =>
  `https://kartta.hel.fi/?e=${25496000 + i * 10}&n=${6672000 + i * 10}&r=2&l=Karttasarja&geom=${encodeURIComponent(
    `POLYGON ((${25496000 + i * 10} ${6672000 + i * 10}, ${25496010 + i * 10} ${6672000 + i * 10}, ${25496010 + i * 10} ${6672010 + i * 10}, ${25496000 + i * 10} ${6672000 + i * 10}))`,
  )}`;

const mockFetch = (count: number, total: number) => {
  const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => ({
    json: async () => ({
      hits: {
        total: { value: total, relation: 'eq' },
        hits: Array.from({ length: count }, (_, i) => ({ _id: `id-${i}`, _source: { map_url: mapUrl(i) } })),
      },
    }),
  }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

const renderMap = (total: number) =>
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <Provider store={createStore()}>
        <ResultsMap total={total} />
      </Provider>
    </SWRConfig>,
  );

const notice = () => screen.queryByText(/^The map shows/);

const originalFetch = globalThis.fetch;

describe('ResultsMap', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('fetches all results of the search for the map, not just one page', async () => {
    const fetchMock = mockFetch(3, 3);
    renderMap(3);

    await screen.findByRole('link', { name: /Open large version of the map/ });
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1].body));

    expect(body.from).toBe(0);
    expect(body.size).toBeGreaterThan(30);
    expect(body._source).toEqual(['map_url']);
  });

  test('shows no notice when all results fit on the map', async () => {
    mockFetch(3, 3);
    renderMap(3);

    await screen.findByRole('link', { name: /Open large version of the map/ });
    expect(notice()).toBeNull();
  });

  test('tells how many results are shown when they do not all fit', async () => {
    mockFetch(250, 400);
    renderMap(400);

    const label = await screen.findByText(/^The map shows \d+ of 400 vehicle removal requests$/);
    const shown = Number(label.textContent?.match(/shows (\d+)/)?.[1]);

    expect(shown).toBeGreaterThan(100);
    expect(shown).toBeLessThan(250);
    expect(screen.getByText('Narrow down your search to see all of them on the map.')).not.toBeNull();
  });
});
