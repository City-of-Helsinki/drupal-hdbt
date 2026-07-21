import { render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import ResultsError from './ResultsError';

describe('ResultsError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders the default error label and message', () => {
    const { getByText } = render(<ResultsError />);
    expect(getByText('An error occurred while loading the content')).toBeTruthy();
    expect(getByText('Please reload the page or try again later.')).toBeTruthy();
  });

  test('renders a custom error message when provided', () => {
    const { getByText, queryByText } = render(<ResultsError errorMessage='No connection to the service.' />);
    expect(getByText('No connection to the service.')).toBeTruthy();
    expect(queryByText('Please reload the page or try again later.')).toBeNull();
  });

  test('applies the given class name to the wrapper', () => {
    const { container } = render(<ResultsError className='search-error' />);
    expect(container.firstElementChild?.className).toBe('search-error');
  });

  test('renders the heading at the requested level', () => {
    const { getByRole } = render(<ResultsError headingLevel={2} />);
    expect(getByRole('heading').getAttribute('aria-level')).toBe('2');
  });

  test('defaults the heading level to 3', () => {
    const { getByRole } = render(<ResultsError />);
    expect(getByRole('heading').getAttribute('aria-level')).toBe('3');
  });

  test('forwards the ref to the wrapper element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ResultsError ref={ref} className='search-error' />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toBe('search-error');
  });

  test('logs non-TypeError errors so they reach Sentry', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('boom');
    render(<ResultsError error={error} />);
    expect(spy).toHaveBeenCalledWith('Error loading data from Elastic:', error);
  });

  test('suppresses TypeErrors caused by aborted fetches', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ResultsError error={new TypeError('Failed to fetch')} />);
    expect(spy).not.toHaveBeenCalled();
  });
});
