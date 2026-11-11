import { renderHook } from '@testing-library/react';
import type { Option } from 'hds-react';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';
import { type SearchState, submittedStateAtom } from '../store';
import useVehicleRemovalQuery from './useVehicleRemovalQuery';

const option = (value: string): Option => ({
  value,
  label: value,
  selected: true,
  isGroupLabel: false,
  visible: true,
  disabled: false,
});

const emptyState: SearchState = { streets: [], postalCodes: [], parkingZones: [], page: 1 };

const renderQuery = (state: Partial<SearchState> = {}, override: { size?: number; from?: number } = {}) => {
  const store = createStore();
  store.set(submittedStateAtom, { ...emptyState, ...state });
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  const { result } = renderHook(() => useVehicleRemovalQuery(override), { wrapper });

  return JSON.parse(result.current);
};

const validToFilter = [{ range: { valid_to: { gte: 'now-1d' } } }];

describe('useVehicleRemovalQuery', () => {
  test('filters out ended removals when nothing is selected', () => {
    const query = renderQuery();

    expect(query.query.function_score.query).toEqual({ bool: { filter: validToFilter } });
  });

  test.each([
    ['streets', { streets: [option('Mannerheimintie')] }, { terms: { street_names: ['Mannerheimintie'] } }],
    ['postal codes', { postalCodes: [option('00100')] }, { terms: { postal_codes: ['00100'] } }],
    ['parking zones', { parkingZones: [option('A')] }, { terms: { parking_zone_names: ['A'] } }],
  ])('combines the filter with selected %s', (_label, state, term) => {
    const query = renderQuery(state);

    expect(query.query.function_score.query).toEqual({
      bool: { filter: validToFilter, should: [term], minimum_should_match: 1 },
    });
  });

  test('matches any of several selections', () => {
    const query = renderQuery({ streets: [option('Mannerheimintie')], postalCodes: [option('00100')] });

    expect(query.query.function_score.query.bool.should).toHaveLength(2);
    expect(query.query.function_score.query.bool.minimum_should_match).toBe(1);
  });

  test('keeps the scoring by start date', () => {
    const query = renderQuery();

    expect(query.query.function_score.functions).toEqual([
      { linear: { valid_from: { origin: 'now', scale: '7d', decay: 0.5 } } },
    ]);
    expect(query.query.function_score.boost_mode).toBe('replace');
  });

  test('paginates by page and honours overrides', () => {
    expect(renderQuery({ page: 3 })).toMatchObject({ size: 30, from: 60 });
    expect(renderQuery({ page: 3 }, { size: 10, from: 0 })).toMatchObject({ size: 10, from: 0 });
  });
});
