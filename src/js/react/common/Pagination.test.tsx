import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  test('marks the current page as active', () => {
    const { container } = render(<Pagination updatePage={vi.fn()} currentPage={3} pages={5} totalPages={10} />);
    const active = container.querySelector('.pager__item.is-active');
    expect(active?.textContent).toBe('3');
  });

  test('renders the window of page links around the current page', () => {
    const { container } = render(<Pagination updatePage={vi.fn()} currentPage={3} pages={5} totalPages={10} />);
    const numbers = Array.from(container.querySelectorAll('.hds-pagination__item-link')).map((el) => el.textContent);
    expect(numbers).toEqual(['1', '2', '3', '4', '5', '10']);
  });

  test('shows a shortcut to the last page with an ellipsis when it is out of range', () => {
    const { container } = render(<Pagination updatePage={vi.fn()} currentPage={3} pages={5} totalPages={10} />);
    expect(container.querySelector('.hds-pagination__item-ellipsis')?.textContent).toBe('...');
    const links = container.querySelectorAll('.hds-pagination__item-link');
    expect(links[links.length - 1].textContent).toBe('10');
  });

  test('calls updatePage with the previous page when the prev link is clicked', () => {
    const updatePage = vi.fn();
    const { container } = render(<Pagination updatePage={updatePage} currentPage={3} pages={5} totalPages={10} />);
    fireEvent.click(container.querySelector('.hds-pagination__button-prev') as Element);
    expect(updatePage).toHaveBeenCalledWith(expect.anything(), 2);
  });

  test('calls updatePage with the next page when the next link is clicked', () => {
    const updatePage = vi.fn();
    const { container } = render(<Pagination updatePage={updatePage} currentPage={3} pages={5} totalPages={10} />);
    fireEvent.click(container.querySelector('.hds-pagination__button-next') as Element);
    expect(updatePage).toHaveBeenCalledWith(expect.anything(), 4);
  });

  test('calls updatePage with the clicked page number', () => {
    const updatePage = vi.fn();
    const { getByText } = render(<Pagination updatePage={updatePage} currentPage={3} pages={5} totalPages={10} />);
    fireEvent.click(getByText('5'));
    expect(updatePage).toHaveBeenCalledWith(expect.anything(), 5);
  });

  test('disables the prev button on the first page', () => {
    const { container } = render(<Pagination updatePage={vi.fn()} currentPage={1} pages={5} totalPages={10} />);
    const prev = container.querySelector('.hds-pagination__button-prev');
    expect(prev?.tagName).toBe('BUTTON');
    expect((prev as HTMLButtonElement).disabled).toBe(true);
  });

  test('disables the next button on the last page', () => {
    const { container } = render(<Pagination updatePage={vi.fn()} currentPage={10} pages={5} totalPages={10} />);
    const next = container.querySelector('.hds-pagination__button-next');
    expect(next?.tagName).toBe('BUTTON');
    expect((next as HTMLButtonElement).disabled).toBe(true);
  });
});
