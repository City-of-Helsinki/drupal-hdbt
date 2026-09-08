import type { estypes } from '@elastic/elasticsearch';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { describe, expect, test } from 'vitest';
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

    store.set(submittedStateAtom, { page: 1 });
    rerender(ui(response(3)));

    expect(document.activeElement).toBe(heading(container));
  });
});
