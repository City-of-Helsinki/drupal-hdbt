import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import SelectionsWrapper from './SelectionsWrapper';

describe('SelectionsWrapper', () => {
  test('renders nothing when there is no content', () => {
    const { container } = render(
      <SelectionsWrapper showClearButton={false} resetForm={vi.fn()}>
        {false}
      </SelectionsWrapper>,
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing for whitespace-only string children', () => {
    const { container } = render(
      <SelectionsWrapper showClearButton={false} resetForm={vi.fn()}>
        {'   '}
      </SelectionsWrapper>,
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders the wrapper and children when there is content', () => {
    const { container, getByText } = render(
      <SelectionsWrapper showClearButton resetForm={vi.fn()}>
        <li>Culture</li>
      </SelectionsWrapper>,
    );
    expect(container.querySelector('.hdbt-search__selections-wrapper')).not.toBeNull();
    expect(getByText('Culture')).toBeTruthy();
  });

  test('appends the modifier class to the wrapper', () => {
    const { container } = render(
      <SelectionsWrapper showClearButton resetForm={vi.fn()} modifierClass='news'>
        <li>Culture</li>
      </SelectionsWrapper>,
    );
    expect(container.querySelector('.hdbt-search__selections-wrapper')?.className).toContain('news');
  });

  test('shows the clear button when showClearButton is truthy', () => {
    const { container } = render(
      <SelectionsWrapper showClearButton resetForm={vi.fn()}>
        <li>Culture</li>
      </SelectionsWrapper>,
    );
    const button = container.querySelector('.hdbt-search__clear-all-button') as HTMLButtonElement;
    expect(button.getAttribute('aria-hidden')).toBe('false');
    expect(button.style.visibility).not.toBe('hidden');
  });

  test('visually hides the clear button when showClearButton is falsy', () => {
    const { container } = render(
      <SelectionsWrapper showClearButton={false} resetForm={vi.fn()}>
        <li>Culture</li>
      </SelectionsWrapper>,
    );
    const button = container.querySelector('.hdbt-search__clear-all-button') as HTMLButtonElement;
    expect(button.getAttribute('aria-hidden')).toBe('true');
    expect(button.style.visibility).toBe('hidden');
  });

  test('calls resetForm when the clear button is clicked', () => {
    const resetForm = vi.fn();
    const { container } = render(
      <SelectionsWrapper showClearButton resetForm={resetForm}>
        <li>Culture</li>
      </SelectionsWrapper>,
    );
    fireEvent.click(container.querySelector('.hdbt-search__clear-all-button') as Element);
    expect(resetForm).toHaveBeenCalledTimes(1);
  });
});
