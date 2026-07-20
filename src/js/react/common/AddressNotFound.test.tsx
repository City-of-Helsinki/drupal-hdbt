import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test } from 'vitest';
import { AddressNotFound } from './AddressNotFound';

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
