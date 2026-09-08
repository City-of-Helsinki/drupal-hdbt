import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { describe, expect, test } from 'vitest';
import { submittedStateAtom } from '../store';
import ResultsList from './ResultsList';

const hits = (total: number) => ({
  hits: {
    total: { value: total, relation: 'eq' },
    hits: Array.from({ length: total }, (_, i) => ({
      _id: `id-${i}`,
      _source: { address: `Street ${i}`, time_range: '8-16' },
    })),
  },
});

const baseProps = { error: '', isLoading: false, isValidating: false };

const heading = (container: HTMLElement) => container.querySelector('.hdbt-search--react__results--title');

describe('ResultsList', () => {
  test('focuses the results heading on resubmit after the empty state has been rendered', () => {
    const store = createStore();
    const ui = (data: unknown) => (
      <Provider store={store}>
        <ResultsList {...baseProps} data={data as any} />
      </Provider>
    );

    const { container, rerender } = render(ui(hits(3)));

    rerender(ui(hits(0)));
    rerender(ui(hits(3)));

    (document.activeElement as HTMLElement)?.blur();

    store.set(submittedStateAtom, { page: 1 });
    rerender(ui(hits(3)));

    expect(document.activeElement).toBe(heading(container));
  });
});
