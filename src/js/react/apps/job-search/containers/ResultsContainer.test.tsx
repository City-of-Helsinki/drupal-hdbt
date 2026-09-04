import type { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { deferFocusAtom } from '../store';
import type Job from '../types/Job';
import ResultsContainer from './ResultsContainer';

type QueryState = {
  data: { hits: { hits: unknown[] }; jobs: number; total: number } | undefined;
  error?: unknown;
  isValidating: boolean;
};

const loading: QueryState = { data: undefined, isValidating: true };
const queryState: { current: QueryState } = { current: loading };
const query = { current: 'first-search' };

vi.mock('../hooks/useIndexQuery', () => ({
  default: () => queryState.current,
}));

vi.mock('../hooks/useResultsQuery', () => ({
  useResultsQuery: () => ({
    query: query.current,
    promoted: false,
    handleResults: (data: { hits: { hits: SearchHit<Job>[] }; jobs: number; total: number }) => ({
      results: data.hits.hits,
      jobs: data.jobs,
      total: data.total,
    }),
  }),
}));

vi.mock('../components/results/ResultsList', () => ({
  default: () => <div data-testid='results-list' />,
}));

const results = (jobs: number, total: number): QueryState => ({
  data: { hits: { hits: [{}] }, jobs, total },
  isValidating: false,
});

const revalidating = (state: QueryState): QueryState => ({ ...state, isValidating: true });

const liveRegion = (container: HTMLElement) => container.querySelector('output[aria-live="polite"]');
const isShowingGhosts = (container: HTMLElement) => container.textContent?.includes('Searching for results...');

const renderResults = (deferFocus = true) => {
  const store = createStore();
  store.set(deferFocusAtom, deferFocus);

  // A fresh element every time: React skips the re-render of an identical one.
  const ui = () => (
    <Provider store={store}>
      <ResultsContainer />
    </Provider>
  );
  const { container, rerender } = render(ui());

  return {
    container,
    update: (state: QueryState, newQuery?: string) => {
      queryState.current = state;
      if (newQuery) {
        query.current = newQuery;
      }
      rerender(ui());
    },
  };
};

describe('ResultsContainer', () => {
  beforeEach(() => {
    queryState.current = loading;
    query.current = 'first-search';
  });

  test('keeps the live region mounted while the ghost cards are shown', () => {
    const { container, update } = renderResults();
    const region = liveRegion(container);

    // Initial load: ghost cards, no results yet.
    expect(region).not.toBeNull();
    expect(isShowingGhosts(container)).toBe(true);

    // Results arrive.
    const found = results(12, 10);
    update(found);
    expect(isShowingGhosts(container)).toBe(false);
    expect(liveRegion(container)).toBe(region);

    // live region has to be the same element or nothing gets announced.
    update(revalidating(found), 'second-search');
    expect(isShowingGhosts(container)).toBe(true);
    expect(liveRegion(container)).toBe(region);
  });

 test('does not announce a search that was submitted by hand', () => {
    const { container, update } = renderResults(false);

    const found = results(12, 10);
    update(found);
    update(revalidating(found), 'second-search');
    update(results(5, 4));

    // Focus moves to the results heading instead.
    expect(liveRegion(container)?.textContent).toBe('');
  });

  test('announces a failed search', () => {
    const { container, update } = renderResults();

    const found = results(12, 10);
    update(found);
    update(revalidating(found), 'second-search');
    update({ data: undefined, error: new Error('Elasticsearch is down'), isValidating: false });

    expect(liveRegion(container)?.textContent).toBe('An error occurred while loading the content');
  });
});
