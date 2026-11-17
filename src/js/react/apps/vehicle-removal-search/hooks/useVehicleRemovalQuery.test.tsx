import { renderHook } from '@testing-library/react';
import type { Option } from 'hds-react';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';
import { submittedStateAtom } from '../store';
import useVehicleRemovalQuery from './useVehicleRemovalQuery';

const getInnerQuery = (streets: Option[] = []) => {
  const store = createStore();
  store.set(submittedStateAtom, { streets, postalCodes: [], parkingZones: [], page: 1 });
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  const { result } = renderHook(() => useVehicleRemovalQuery(), { wrapper });

  return JSON.parse(result.current).query.function_score.query;
};

const filter = [{ range: { valid_to: { gte: 'now-1d' } } }];

describe('useVehicleRemovalQuery', () => {
  test('filters out ended removals', () => {
    expect(getInnerQuery()).toEqual({ bool: { filter } });
  });

  test('filters out ended removals with selections', () => {
    const streets = [{ value: 'Mannerheimintie', label: 'Mannerheimintie' } as Option];

    expect(getInnerQuery(streets)).toEqual({
      bool: { filter, should: [{ terms: { street_names: ['Mannerheimintie'] } }], minimum_should_match: 1 },
    });
  });
});
