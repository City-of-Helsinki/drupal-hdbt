// biome-ignore-all lint/suspicious/noExplicitAny: tests use minimal Elastic response stubs
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ResultsWrapper } from './ResultsWrapper';

const baseProps = {
  currentPage: 1,
  getHeaderText: () => '2 results',
  isValidating: false,
  queryString: 'test',
  resultItemCallBack: (item: any) => <li key={item._id}>Item {item._id}</li>,
  setPage: vi.fn(),
  size: 10,
  trigger: 0,
};

const dataWith = (hits: Array<{ _id: string }>, total: number | { value: number } = hits.length) => ({
  hits: { total, hits },
});

const headerOf = (container: HTMLElement) => container.querySelector('.hdbt-search--react__results--title');

const pageLink = (container: HTMLElement, page: string) =>
  Array.from(container.querySelectorAll('.hds-pagination__item-link')).find((el) => el.textContent === page) as Element;

describe('ResultsWrapper', () => {
  test('renders a bordered ghost list with the searching header while validating with no data', () => {
    const { container, getByText } = render(<ResultsWrapper {...baseProps} isValidating />);
    expect(getByText('Searching for results...')).toBeTruthy();
    expect(container.querySelectorAll('.card--ghost.card--border')).toHaveLength(10);
  });

  test('renders the error state when there is an error', () => {
    const { getByText } = render(<ResultsWrapper {...baseProps} error='boom' />);
    expect(getByText('An error occurred while loading the content')).toBeTruthy();
  });

  test('replaces the error with ghost cards once a new query starts loading', () => {
    const { container, rerender, getByText } = render(<ResultsWrapper {...baseProps} queryString='a' error='boom' />);
    expect(getByText('An error occurred while loading the content')).toBeTruthy();

    rerender(<ResultsWrapper {...baseProps} queryString='b' error='boom' isValidating />);
    expect(container.querySelectorAll('.card--ghost.card--border')).toHaveLength(10);
  });

  test('renders the empty state when there are no hits', () => {
    const { getByText } = render(<ResultsWrapper {...baseProps} data={dataWith([]) as any} />);
    expect(getByText('No results')).toBeTruthy();
  });

  test('renders the header, result items and pagination when there are hits', () => {
    const { getByText, container } = render(
      <ResultsWrapper {...baseProps} data={dataWith([{ _id: 'a' }, { _id: 'b' }], 25) as any} />,
    );
    expect(getByText('2 results')).toBeTruthy();
    expect(getByText('Item a')).toBeTruthy();
    expect(getByText('Item b')).toBeTruthy();
    expect(container.querySelector('.hds-pagination')).not.toBeNull();
  });

  test('adds a trailing page when the total does not divide evenly', () => {
    const { container } = render(<ResultsWrapper {...baseProps} data={dataWith([{ _id: 'a' }], 25) as any} />);
    const numbers = Array.from(container.querySelectorAll('.hds-pagination__item-link')).map((el) => el.textContent);
    expect(numbers[numbers.length - 1]).toBe('3');
  });

  test('reads the total from the object form of hits.total', () => {
    const { container } = render(
      <ResultsWrapper {...baseProps} data={dataWith([{ _id: 'a' }], { value: 25 }) as any} />,
    );
    const numbers = Array.from(container.querySelectorAll('.hds-pagination__item-link')).map((el) => el.textContent);
    expect(numbers[numbers.length - 1]).toBe('3');
  });

  test('shows ghost cards when a new query is fetched and the previous data is still displayed', () => {
    const data = dataWith([{ _id: 'a' }], 25) as any;
    const { container, rerender } = render(<ResultsWrapper {...baseProps} queryString='a' data={data} />);
    expect(container.querySelectorAll('.card--ghost')).toHaveLength(0);

    // Same data object, new key: a real fetch is in flight.
    rerender(<ResultsWrapper {...baseProps} queryString='b' data={data} isValidating />);
    expect(container.querySelectorAll('.card--ghost.card--border')).toHaveLength(10);
  });

  test('keeps rendering results without ghost cards when a new query is served from cache', () => {
    const { container, rerender } = render(
      <ResultsWrapper {...baseProps} queryString='a' data={dataWith([{ _id: 'a' }], 25) as any} />,
    );

    // Cache hit: data updates in the same render as the new key.
    rerender(<ResultsWrapper {...baseProps} queryString='b' data={dataWith([{ _id: 'b' }], 25) as any} isValidating />);
    expect(container.querySelectorAll('.card--ghost')).toHaveLength(0);
    expect(container.textContent).toContain('Item b');
  });

  test('moves focus to the ghost heading and then to the results heading during a new search', () => {
    const first = dataWith([{ _id: 'a' }], 25) as any;
    const { container, rerender } = render(<ResultsWrapper {...baseProps} queryString='a' data={first} />);

    rerender(<ResultsWrapper {...baseProps} queryString='b' data={first} isValidating />);
    expect(document.activeElement).toBe(headerOf(container));
    expect(document.activeElement?.textContent).toBe('Searching for results... ');

    rerender(<ResultsWrapper {...baseProps} queryString='b' data={dataWith([{ _id: 'b' }], 25) as any} />);
    expect(document.activeElement).toBe(headerOf(container));
    expect(document.activeElement?.textContent).toBe('2 results ');
  });

  test('does not steal focus while a filter dialog is open', () => {
    const dialog = document.createElement('div');
    dialog.className = 'collapsible__children';
    dialog.setAttribute('role', 'dialog');
    document.body.appendChild(dialog);

    const data = dataWith([{ _id: 'a' }], 25) as any;
    const { rerender } = render(<ResultsWrapper {...baseProps} queryString='a' data={data} />);
    rerender(<ResultsWrapper {...baseProps} queryString='b' data={data} isValidating />);
    expect(document.activeElement).toBe(document.body);

    document.body.removeChild(dialog);
  });

  test('focuses the results heading when the same query is resubmitted', () => {
    const data = dataWith([{ _id: 'a' }], 25) as any;
    const { container, rerender } = render(<ResultsWrapper {...baseProps} queryString='a' data={data} trigger={0} />);

    rerender(<ResultsWrapper {...baseProps} queryString='a' data={data} trigger={1} />);
    expect(document.activeElement).toBe(headerOf(container));
  });

  test('updates the page and skips the results focus when a pager link is clicked', () => {
    const setPage = vi.fn();
    const first = dataWith([{ _id: 'a' }], 25) as any;
    const { container, rerender } = render(
      <ResultsWrapper {...baseProps} setPage={setPage} queryString='page=1' data={first} />,
    );

    fireEvent.click(pageLink(container, '2'));
    expect(setPage).toHaveBeenCalledWith('2');

    // The pager scrolls to the first result itself, so the results heading must not
    // grab focus once the next page arrives.
    rerender(<ResultsWrapper {...baseProps} setPage={setPage} queryString='page=2' data={first} isValidating />);
    rerender(
      <ResultsWrapper
        {...baseProps}
        setPage={setPage}
        queryString='page=2'
        data={dataWith([{ _id: 'b' }], 25) as any}
      />,
    );
    expect(document.activeElement).not.toBe(headerOf(container));
  });

  test('keeps skipping the results focus when the pager lands on a page served from cache', () => {
    const setPage = vi.fn();
    const first = dataWith([{ _id: 'a' }], 25) as any;
    const cached = dataWith([{ _id: 'b' }], 25) as any;
    const page1 = { ...baseProps, setPage, queryString: 'page=1', trigger: 'page=1' };
    const page2 = { ...baseProps, setPage, queryString: 'page=2', trigger: 'page=2' };

    // Initial load: the first fetch resolves and must not take focus.
    const { container, rerender } = render(<ResultsWrapper {...page1} isValidating />);
    rerender(<ResultsWrapper {...page1} data={first} />);
    expect(document.activeElement).toBe(document.body);

    fireEvent.click(pageLink(container, '2'));

    // SWR hands over the cached data for the new key while isValidating is still
    // false — the revalidation only starts after that render.
    rerender(<ResultsWrapper {...page2} data={cached} />);
    rerender(<ResultsWrapper {...page2} data={cached} isValidating />);
    rerender(<ResultsWrapper {...page2} data={cached} />);

    // The caller focuses the first result itself (useScrollToFirstItem).
    expect(document.activeElement).not.toBe(headerOf(container));
  });
});
