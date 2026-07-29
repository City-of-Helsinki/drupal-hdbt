import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test } from 'vitest';
import ResultsEmpty from './ResultsEmpty';

describe('ResultsEmpty', () => {
  test('renders the default title and body text', () => {
    const { getByText } = render(<ResultsEmpty />);
    expect(getByText('No results')).toBeTruthy();
    expect(
      getByText('No results were found for the criteria you entered. Try changing your search criteria.'),
    ).toBeTruthy();
  });

  test('renders custom title and body text when provided', () => {
    const { getByText, queryByText } = render(
      <ResultsEmpty resultText='Nothing here' bodyText='Try a broader search.' />,
    );
    expect(getByText('Nothing here')).toBeTruthy();
    expect(getByText('Try a broader search.')).toBeTruthy();
    expect(queryByText('No results')).toBeNull();
  });

  test('renders an additional description paragraph when provided', () => {
    const { getByText } = render(<ResultsEmpty additionalDescription='Contact us for help.' />);
    expect(getByText('Contact us for help.')).toBeTruthy();
  });

  test('renders children', () => {
    const { getByText } = render(
      <ResultsEmpty>
        <button type='button'>Reset filters</button>
      </ResultsEmpty>,
    );
    expect(getByText('Reset filters')).toBeTruthy();
  });

  test('uses the default wrapper class', () => {
    const { container } = render(<ResultsEmpty />);
    expect(container.firstElementChild?.className).toBe('react-search__results');
  });

  test('applies a custom wrapper class', () => {
    const { container } = render(<ResultsEmpty wrapperClass='unit-search__results' />);
    expect(container.firstElementChild?.className).toBe('unit-search__results');
  });

  test('forwards the ref to the heading rendered by ResultsHeader', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ResultsEmpty ref={ref} />);
    expect(ref.current?.tagName).toBe('H3');
  });
});
