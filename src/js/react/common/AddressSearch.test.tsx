import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AddressSearch } from './AddressSearch';

describe('AddressSearch', () => {
  test('renders inside the default filter wrapper', () => {
    const { container } = render(<AddressSearch onSubmit={vi.fn()} />);
    expect(container.firstElementChild?.className).toBe('hdbt-search__filter');
    expect(container.querySelector('output')).toBeNull();
  });

  test('uses a custom wrapper class name', () => {
    const { container } = render(<AddressSearch onSubmit={vi.fn()} className='address-filter' />);
    expect(container.firstElementChild?.className).toBe('address-filter');
  });

  test('adds the location modifier and a live region when useLocation is set', () => {
    const { container } = render(<AddressSearch onSubmit={vi.fn()} useLocation />);
    expect(container.firstElementChild?.className).toContain('hdbt-search__filter--with-location');
    expect(container.querySelector('output[aria-live="polite"]')).not.toBeNull();
  });

  test('shows the address error message when error is set', () => {
    const { getByText } = render(<AddressSearch onSubmit={vi.fn()} error />);
    expect(getByText(/Make sure the address is correct/)).toBeTruthy();
  });

  test('treats an explicit not-found the same as error={true}', () => {
    const { getByText } = render(<AddressSearch onSubmit={vi.fn()} error='not-found' />);
    expect(getByText(/Make sure the address is correct/)).toBeTruthy();
  });

  test('does not blame the address when the service map is unavailable', () => {
    const { getByText, queryByText } = render(<AddressSearch onSubmit={vi.fn()} error='unavailable' />);
    expect(getByText(/The address search is temporarily unavailable/)).toBeTruthy();
    expect(queryByText(/Make sure the address is correct/)).toBeNull();
  });

  test('reports an outage when the suggestion lookup fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    render(<AddressSearch onSubmit={vi.fn()} texts={{ label: 'Address' }} />);
    fireEvent.input(screen.getByRole('combobox'), { target: { value: 'Kotikatu' } });

    await waitFor(() => expect(screen.getByText(/The address search is temporarily unavailable/)).toBeTruthy(), {
      timeout: 3000,
    });
  });

  test('does not report an outage while suggestions are being served', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ count: 0, next: null, previous: null, results: [] }),
      }),
    );

    render(<AddressSearch onSubmit={vi.fn()} texts={{ label: 'Address' }} />);
    fireEvent.input(screen.getByRole('combobox'), { target: { value: 'Kotikatu' } });

    await waitFor(() => expect(fetch).toHaveBeenCalled(), { timeout: 3000 });
    expect(screen.queryByText(/The address search is temporarily unavailable/)).toBeNull();
  });

  test('pushes the initial value back to the parent to survive HDS clearing it on mount', () => {
    const onChange = vi.fn();
    render(<AddressSearch onSubmit={vi.fn()} value='Mannerheimintie 1' onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith('Mannerheimintie 1');
  });
});
