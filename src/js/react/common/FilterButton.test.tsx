import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import FilterButton from './FilterButton';

describe('FilterButton', () => {
  test('renders the value as the tag label', () => {
    const { getByText } = render(
      <ul>
        <FilterButton value='Culture' clearSelection={vi.fn()} />
      </ul>,
    );
    expect(getByText('Culture')).toBeTruthy();
  });

  test('renders as an interactive tag list item', () => {
    const { container } = render(
      <ul>
        <FilterButton value='Culture' clearSelection={vi.fn()} />
      </ul>,
    );
    const item = container.querySelector('li');
    expect(item?.className).toContain('content-tags__tags__tag');
    expect(item?.className).toContain('content-tags__tags--interactive');
  });

  test('exposes an accessible remove label including the value', () => {
    const { getByLabelText } = render(
      <ul>
        <FilterButton value='Culture' clearSelection={vi.fn()} />
      </ul>,
    );
    expect(getByLabelText('Remove Culture from search results')).toBeTruthy();
  });

  test('calls clearSelection when the tag delete affordance is activated', () => {
    const clearSelection = vi.fn();
    const { getByLabelText } = render(
      <ul>
        <FilterButton value='Culture' clearSelection={clearSelection} />
      </ul>,
    );
    fireEvent.click(getByLabelText('Remove Culture from search results'));
    expect(clearSelection).toHaveBeenCalledTimes(1);
  });
});
