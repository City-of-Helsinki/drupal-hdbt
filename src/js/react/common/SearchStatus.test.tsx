import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import SearchStatus from './SearchStatus';

const getRegion = (container: HTMLElement) => container.querySelector('output[aria-live="polite"]');

describe('SearchStatus', () => {
  test('renders a polite, visually hidden live region', () => {
    const { container } = render(<SearchStatus announce isValidating={false} text='' />);
    const region = getRegion(container);
    expect(region).not.toBeNull();
    expect(region?.className).toContain('visually-hidden');
  });

  test('stays mounted while the search state changes', () => {
    const { container, rerender } = render(<SearchStatus announce isValidating text='' />);
    const region = getRegion(container);
    rerender(<SearchStatus announce isValidating={false} text='5 results' />);
    expect(getRegion(container)).toBe(region);
  });

  test('stays silent for the first completed search', () => {
    const { container, rerender } = render(<SearchStatus announce isValidating text='' />);
    rerender(<SearchStatus announce isValidating={false} text='5 results' />);
    expect(getRegion(container)?.textContent).toBe('');
  });

  test('announces the result text of later searches', () => {
    const { container, rerender } = render(<SearchStatus announce isValidating text='' />);
    rerender(<SearchStatus announce isValidating={false} text='5 results' />);
    rerender(<SearchStatus announce isValidating text='5 results' />);
    rerender(<SearchStatus announce isValidating={false} text='12 results' />);
    expect(getRegion(container)?.textContent).toBe('12 results');
  });

  test('stays silent while a search is in flight', () => {
    const { container, rerender } = render(<SearchStatus announce isValidating text='' />);
    rerender(<SearchStatus announce isValidating={false} text='5 results' />);
    rerender(<SearchStatus announce isValidating text='12 results' />);
    expect(getRegion(container)?.textContent).toBe('');
  });

  test('stays silent when announce is false', () => {
    const { container, rerender } = render(<SearchStatus announce={false} isValidating text='' />);
    rerender(<SearchStatus announce={false} isValidating={false} text='5 results' />);
    rerender(<SearchStatus announce={false} isValidating text='5 results' />);
    rerender(<SearchStatus announce={false} isValidating={false} text='12 results' />);
    expect(getRegion(container)?.textContent).toBe('');
  });
});
