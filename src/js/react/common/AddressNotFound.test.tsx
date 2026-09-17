import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test } from 'vitest';
import { AddressNotFound, AddressSearchError } from './AddressNotFound';

describe('AddressNotFound', () => {
  test('renders the title and hint text', () => {
    const { getByText, container } = render(<AddressNotFound />);
    expect(container.querySelector('h3.hdbt-search--react__results--title')?.textContent).toBe(
      'No results for the address entered',
    );
    expect(
      getByText('Make sure the address is written correctly. You can also search using a nearby street number.'),
    ).toBeTruthy();
  });

  test('forwards the ref to the heading', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<AddressNotFound ref={ref} />);
    expect(ref.current?.tagName).toBe('H3');
  });
});

describe('AddressSearchError', () => {
  test('renders the not-found wording for a missing address', () => {
    const { container } = render(<AddressSearchError type='not-found' />);
    expect(container.querySelector('h3')?.textContent).toBe('No results for the address entered');
  });

  test('renders the outage wording when the service is unreachable', () => {
    const { container, getByText } = render(<AddressSearchError type='unavailable' />);
    expect(container.querySelector('h3.hdbt-search--react__results--title')?.textContent).toBe(
      'The address search is temporarily unavailable',
    );
    expect(getByText(/We could not reach the address search/)).toBeTruthy();
  });
});
