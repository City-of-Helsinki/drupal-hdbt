import type { estypes } from '@elastic/elasticsearch';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { describe, expect, test, vi } from 'vitest';
import { submittedStateAtom } from '../store';
import type VehicleRemoval from '../types/VehicleRemoval';
import ResultsList from './ResultsList';

const hit = (index: number): estypes.SearchHit<VehicleRemoval> => ({
  _index: 'mobilenote_data',
  _id: `id-${index}`,
  _source: {
    id: `id-${index}`,
    address: `Street ${index}`,
    address_info: '',
    street_names: [`Street ${index}`],
    postal_codes: ['00100'],
    parking_zone_names: ['Taka-Töölö/Meilahti'],
    reason: '',
    sign_type: '',
    notes: '',
    phone: '',
    additional_text: '',
    time_range: '8-16',
    valid_from: 0,
    valid_to: 0,
    map_url: '',
  },
});

const response = (total: number): estypes.SearchResponse<VehicleRemoval> => ({
  took: 1,
  timed_out: false,
  _shards: { total: 1, successful: 1, failed: 0 },
  hits: {
    total: { value: total, relation: 'eq' },
    hits: Array.from({ length: total }, (_, i) => hit(i)),
  },
});

const baseProps = { error: '', isLoading: false, isValidating: false };

const heading = (container: HTMLElement) => container.querySelector('.hdbt-search--react__results--title');

describe('ResultsList', () => {
  test('focuses the results heading on resubmit after the empty state has been rendered', () => {
    const store = createStore();
    const ui = (data: estypes.SearchResponse<VehicleRemoval>) => (
      <Provider store={store}>
        <ResultsList {...baseProps} data={data} />
      </Provider>
    );

    const { container, rerender } = render(ui(response(3)));

    rerender(ui(response(0)));
    rerender(ui(response(3)));

    (document.activeElement as HTMLElement)?.blur();

    act(() => store.set(submittedStateAtom, { page: 1 }));
    rerender(ui(response(3)));

    expect(document.activeElement).toBe(heading(container));
  });

  test('hides the pager in map view', () => {
    // Keep the map from fetching.
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn(() => new Promise<Response>(() => {}));

    const store = createStore();
    // More results than fit on one page, so the pager is shown.
    render(
      <Provider store={store}>
        <ResultsList {...baseProps} data={response(31)} />
      </Provider>,
    );

    const pager = () => screen.queryByRole('navigation', { name: 'Pagination' });
    expect(pager()).not.toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: 'View in a map' }));
    expect(pager()).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: 'View as a list' }));
    expect(pager()).not.toBeNull();

    globalThis.fetch = originalFetch;
  });
});
