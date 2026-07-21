import { render } from '@testing-library/react';
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

  test('pushes the initial value back to the parent to survive HDS clearing it on mount', () => {
    const onChange = vi.fn();
    render(<AddressSearch onSubmit={vi.fn()} value='Mannerheimintie 1' onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith('Mannerheimintie 1');
  });
});
