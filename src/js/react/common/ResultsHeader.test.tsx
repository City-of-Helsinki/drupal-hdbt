import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test } from 'vitest';
import ResultsHeader from './ResultsHeader';

describe('ResultsHeader', () => {
  test('renders the result text in the h3 title', () => {
    const { container } = render(<ResultsHeader resultText='5 results' />);
    const title = container.querySelector('h3.hdbt-search--react__results--title');
    expect(title?.textContent).toContain('5 results');
  });

  test('renders the optional results text in parentheses', () => {
    const { container } = render(<ResultsHeader resultText='5 results' optionalResultsText='2 hidden' />);
    expect(container.querySelector('h3')?.textContent).toContain('(2 hidden)');
  });

  test('omits the parentheses when no optional text is given', () => {
    const { container } = render(<ResultsHeader resultText='5 results' />);
    expect(container.querySelector('h3')?.textContent).not.toContain('(');
  });

  test('renders actions inside a container with the given class', () => {
    const { container } = render(
      <ResultsHeader resultText='5 results' actions={<button type='button'>Sort</button>} actionsClass='sort-area' />,
    );
    const actions = container.querySelector('.sort-area');
    expect(actions?.querySelector('button')?.textContent).toBe('Sort');
  });

  test('uses the plain top-area layout when there are no left actions', () => {
    const { container } = render(<ResultsHeader resultText='5 results' />);
    expect(container.querySelector('.hdbt-search--react__result-top-area')).not.toBeNull();
    expect(container.querySelector('.hdbt-search--react__result-top-area--with-left-actions')).toBeNull();
  });

  test('switches to the with-left-actions layout and renders left actions', () => {
    const { container } = render(
      <ResultsHeader resultText='5 results' leftActions={<span className='view-toggle'>Map</span>} />,
    );
    expect(container.querySelector('.hdbt-search--react__result-top-area--with-left-actions')).not.toBeNull();
    expect(container.querySelector('.view-toggle')?.textContent).toBe('Map');
  });

  test('forwards the ref to the heading element', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<ResultsHeader resultText='5 results' ref={ref} />);
    expect(ref.current?.tagName).toBe('H3');
    expect(ref.current?.className).toContain('hdbt-search--react__results--title');
  });
});
