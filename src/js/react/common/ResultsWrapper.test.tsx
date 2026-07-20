// biome-ignore-all lint/suspicious/noExplicitAny: tests use minimal Elastic response stubs
import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ResultsWrapper } from './ResultsWrapper';

const baseProps = {
  currentPage: 1,
  getHeaderText: () => '2 results',
  resultItemCallBack: (item: any) => <li key={item._id}>Item {item._id}</li>,
  setPage: vi.fn(),
  size: 10,
};

const dataWith = (hits: Array<{ _id: string }>, total = hits.length) => ({
  hits: { total, hits },
});

describe('ResultsWrapper', () => {
  test('renders a bordered ghost list while loading with no data', () => {
    const { container } = render(<ResultsWrapper {...baseProps} isLoading />);
    expect(container.querySelectorAll('.card--ghost.card--border')).toHaveLength(10);
  });

  test('renders the error state when there is an error', () => {
    const { getByText } = render(<ResultsWrapper {...baseProps} isLoading={false} error='boom' />);
    expect(getByText('An error occurred while loading the content')).toBeTruthy();
  });

  test('renders the empty state when there are no hits', () => {
    const { getByText } = render(<ResultsWrapper {...baseProps} isLoading={false} data={dataWith([]) as any} />);
    expect(getByText('No results')).toBeTruthy();
  });

  test('renders the header, result items and pagination when there are hits', () => {
    const { getByText, container } = render(
      <ResultsWrapper {...baseProps} isLoading={false} data={dataWith([{ _id: 'a' }, { _id: 'b' }], 25) as any} />,
    );
    expect(getByText('2 results')).toBeTruthy();
    expect(getByText('Item a')).toBeTruthy();
    expect(getByText('Item b')).toBeTruthy();
    expect(container.querySelector('.hds-pagination')).not.toBeNull();
  });

  test('adds a trailing page when the total does not divide evenly', () => {
    const { container } = render(
      <ResultsWrapper {...baseProps} currentPage={1} isLoading={false} data={dataWith([{ _id: 'a' }], 25) as any} />,
    );
    const numbers = Array.from(container.querySelectorAll('.hds-pagination__item-link')).map((el) => el.textContent);
    expect(numbers[numbers.length - 1]).toBe('3');
  });
});
