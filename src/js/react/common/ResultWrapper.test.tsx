import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ResultWrapper from './ResultWrapper';

describe('ResultWrapper', () => {
  test('renders children', () => {
    const { getByText } = render(
      <ResultWrapper loading={false}>
        <p>Results</p>
      </ResultWrapper>,
    );
    expect(getByText('Results')).toBeTruthy();
  });

  test('shows the ghost list only while loading', () => {
    const { container, rerender } = render(<ResultWrapper loading={false} />);
    expect(container.querySelector('.card--ghost')).toBeNull();
    rerender(<ResultWrapper loading />);
    expect(container.querySelector('.card--ghost')).not.toBeNull();
  });

  test('appends the class name to the wrapper', () => {
    const { container } = render(<ResultWrapper loading={false} className='news' />);
    expect(container.firstElementChild?.className).toBe('hdbt__loading-wrapper news');
  });
});
